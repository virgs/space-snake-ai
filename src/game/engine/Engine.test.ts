import { describe, it, expect, beforeEach } from 'vitest'
import { Engine, Directions, CellTypes, ActionResult, GameState, CoordinateString, SnakeCell } from './Engine'

describe('Engine', () => {
    let engine: Engine
    let initialGameState: GameState

    beforeEach(() => {
        // Create a simple initial game state for testing
        initialGameState = {
            totalSteps: 0,
            score: 0,
            snake: {
                direction: Directions.RIGHT,
                head: '2,2' as CoordinateString,
                tail: '0,2' as CoordinateString,
            },
            map: {
                '0,2': { type: CellTypes.SNAKE, previousBody: '1,2' as CoordinateString, growth: false }, // tail points to next segment
                '1,2': { type: CellTypes.SNAKE, previousBody: '2,2' as CoordinateString, growth: false }, // middle points to head
                '2,2': { type: CellTypes.SNAKE, previousBody: undefined, growth: false }, // head has no next segment
                '4,2': { type: CellTypes.FOOD },
                '0,0': { type: CellTypes.WALL },
            },
        }
        engine = new Engine(initialGameState)
    })

    it('should prevent moving in opposite direction', () => {
        const result = engine.update(Directions.LEFT) // opposite of current RIGHT direction

        expect(result.result).toBe(ActionResult.INVALID_ACTION)
        expect(result.action).toBe(Directions.LEFT)
        expect(result.newGameState.snake.direction).toBe(Directions.RIGHT) // unchanged
        expect(result.newGameState.totalSteps).toBe(0) // no step taken
    })

    it('should detect wall collision', () => {
        // Move snake to a position where it will hit a wall
        const wallGameState = {
            ...initialGameState,
            snake: {
                direction: Directions.UP,
                head: '0,1' as CoordinateString,
                tail: '0,3' as CoordinateString,
            },
        }
        const wallEngine = new Engine(wallGameState)

        const result = wallEngine.update(Directions.UP) // will hit wall at 0,0

        expect(result.result).toBe(ActionResult.WALL_COLLISION)
        expect(result.action).toBe(Directions.UP)
    })

    it('should detect snake body collision', () => {
        // Create a scenario where snake will collide with itself
        const selfCollisionGameState = {
            ...initialGameState,
            snake: {
                direction: Directions.RIGHT,
                head: '1,1' as CoordinateString,
                tail: '0,2' as CoordinateString,
            },
            map: {
                ...initialGameState.map,
                '1,1': { type: CellTypes.SNAKE, previousBody: '0,1' as CoordinateString, growth: false },
                '0,1': { type: CellTypes.SNAKE, previousBody: '0,2' as CoordinateString, growth: false },
                '2,1': { type: CellTypes.SNAKE, previousBody: '1,1' as CoordinateString, growth: false },
            },
        }
        const selfCollisionEngine = new Engine(selfCollisionGameState)

        const result = selfCollisionEngine.update(Directions.DOWN) // will hit snake body at 1,2

        expect(result.result).toBe(ActionResult.SNAKE_COLLISION)
        expect(result.action).toBe(Directions.DOWN)
    })

    it('should successfully move snake and increment steps', () => {
        const result = engine.update(Directions.UP)

        expect(result.result).toBe(ActionResult.NOTHING)
        expect(result.action).toBe(Directions.UP)
        expect(result.newGameState.totalSteps).toBe(1)
        expect(result.newGameState.snake.direction).toBe(Directions.UP)
        expect(result.newGameState.snake.head).toBe('2,1')
    })

    it('should eat food and increment score', () => {
        const result = engine.update(Directions.RIGHT) // move towards food at 4,2
        const result2 = new Engine(result.newGameState).update(Directions.RIGHT) // eat the food

        expect(result2.result).toBe(ActionResult.SCORED)
        expect(result2.newGameState.score).toBe(1) // score incremented
        expect(result2.newGameState.snake.head).toBe('4,2') // head at food position
        // Food should be consumed (no longer in map as food)
        expect(result2.newGameState.map['4,2']?.type).toBe(CellTypes.SNAKE)
        // The tail should be marked for growth to prevent removal in the next turn
        expect((result2.newGameState.map[result2.newGameState.snake.head] as SnakeCell)?.growth).toBe(true)
    })

    it('should remove tail in next move after growth', () => {
        const tailCoordinate = initialGameState.snake.tail
        const initialTailPreviousBody = (initialGameState.map[tailCoordinate] as SnakeCell).previousBody

        ;(initialGameState.map[initialGameState.snake.tail] as SnakeCell).growth = true // mark tail for growth

        // the growth flag should be consumed and tail should NOT move
        const result = new Engine(initialGameState).update(Directions.RIGHT)

        expect(result.newGameState.snake.tail).toBe(tailCoordinate) // stays at initial tail position
        expect(result.newGameState.map[tailCoordinate]).toBeDefined()

        // The tail should NOT be marked for growth anymore
        expect((result.newGameState.map[tailCoordinate] as SnakeCell)?.growth).toBe(false)

        const nextIterationResult = new Engine(result.newGameState).update(Directions.RIGHT)

        // The tail should stay in the same position and growth flag should be consumed
        expect(nextIterationResult.newGameState.snake.tail).toBe(initialTailPreviousBody)
    })

    it('should continuously remove tail during normal movement (no food)', () => {
        const result1 = engine.update(Directions.UP)

        expect(result1.result).toBe(ActionResult.NOTHING)
        expect(result1.newGameState.score).toBe(0) // no food eaten

        // Tail should move forward (old tail removed)
        expect(result1.newGameState.snake.tail).toBe('1,2')
        expect(result1.newGameState.map['0,2']).toBeUndefined() // old tail removed
        expect(result1.newGameState.map['1,2']).toBeDefined() // new tail exists

        // Snake head should be at new position
        expect(result1.newGameState.snake.head).toBe('2,1')
    })
})
