export enum Directions {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

const OPPOSITE_DIRECTIONS: Record<Directions, Directions> = {
    [Directions.UP]: Directions.DOWN,
    [Directions.DOWN]: Directions.UP,
    [Directions.LEFT]: Directions.RIGHT,
    [Directions.RIGHT]: Directions.LEFT,
}
export type Coordinate = {
    x: number
    y: number
}

const addToCoordinate = (coordinate: Coordinate, direction: Directions): Coordinate => {
    switch (direction) {
        case Directions.UP:
            return { ...coordinate, y: coordinate.y - 1 }
        case Directions.DOWN:
            return { ...coordinate, y: coordinate.y + 1 }
        case Directions.LEFT:
            return { ...coordinate, x: coordinate.x - 1 }
        case Directions.RIGHT:
            return { ...coordinate, x: coordinate.x + 1 }
        default:
            throw new Error(`Invalid direction: ${direction}`)
    }
}

export type CoordinateString = `${number},${number}` // e.g., "1,2"

export enum CellTypes {
    SNAKE = 'snake',
    FOOD = 'food',
    WALL = 'wall',
}

export type BaseCell = {
    type: CellTypes
}

export type SnakeCell = BaseCell & {
    previousBody?: CoordinateString // Reference to the previous body segment
    growth?: boolean // Indicates if this cell is part of a growth segment
    // Additional properties can be added as needed
    // For example, you might want to track the age of the snake segment or its color
    // or any other properties relevant to the game mechanics
}

export type Cell = SnakeCell | BaseCell

export type GameState = {
    totalSteps: number
    score: number
    snake: {
        direction: Directions
        head: CoordinateString
        tail: CoordinateString
    }
    map: Record<CoordinateString, Cell>
}

export enum ActionResult {
    NOTHING = 'NOTHING',
    INVALID_ACTION = 'INVALID_ACTION',
    SCORED = 'SCORED',
    WALL_COLLISION = 'WALL_COLLISION',
    SNAKE_COLLISION = 'SNAKE_COLLISION',
}

export type GameStateUpdateResult = {
    newGameState: GameState
    action: Directions
    result: ActionResult
}

export class Engine {
    private gameState: GameState

    constructor(initialState: GameState) {
        this.gameState = initialState
    }

    public update(action: Directions): GameStateUpdateResult {
        if (!this.validateAction(action)) {
            return this.createFailureResult(action, ActionResult.INVALID_ACTION)
        }

        this.incrementSteps()
        this.updateDirection(action)

        const newHeadCoordinateString = this.calculateNewHeadCoordinateString(action)

        const collisionResult = this.checkAllCollisions(newHeadCoordinateString)
        if (collisionResult) {
            return this.createFailureResult(action, collisionResult)
        }

        const foodEaten = this.checkFoodCollision(newHeadCoordinateString)
        if (foodEaten) {
            this.incrementScore()
        }

        this.addNewHead(newHeadCoordinateString, foodEaten)
        this.updateTail()

        return {
            newGameState: structuredClone(this.gameState),
            action,
            result: foodEaten ? ActionResult.SCORED : ActionResult.NOTHING,
        }
    }

    private calculateNewHead(head: string, action: Directions): Coordinate {
        const [x, y] = head.split(',').map(Number)
        const newHead: Coordinate = { x, y }
        return addToCoordinate(newHead, action)
    }

    private validateAction(action: Directions): boolean {
        // Check if the action is valid (not opposite of current direction)
        return action !== OPPOSITE_DIRECTIONS[this.gameState.snake.direction]
    }

    private checkCollision(head: CoordinateString, cellType: CellTypes): boolean {
        return this.gameState.map[head]?.type === cellType
    }

    private incrementSteps(): void {
        this.gameState.totalSteps += 1
    }

    private updateDirection(action: Directions): void {
        this.gameState.snake.direction = action
    }

    private calculateNewHeadCoordinateString(action: Directions): CoordinateString {
        const newHead = this.calculateNewHead(this.gameState.snake.head, action)
        return `${newHead.x},${newHead.y}`
    }

    private checkAllCollisions(newHeadCoordinateString: CoordinateString): ActionResult | undefined {
        if (this.checkCollision(newHeadCoordinateString, CellTypes.WALL)) {
            return ActionResult.WALL_COLLISION
        }
        if (this.checkCollision(newHeadCoordinateString, CellTypes.SNAKE)) {
            return ActionResult.SNAKE_COLLISION
        }
    }

    private checkFoodCollision(newHeadCoordinateString: CoordinateString): boolean {
        return this.checkCollision(newHeadCoordinateString, CellTypes.FOOD)
    }

    private incrementScore(): void {
        this.gameState.score += 1
    }

    private addNewHead(newHeadCoordinateString: CoordinateString, foodEaten: boolean): void {
        const newHeadCell: SnakeCell = {
            type: CellTypes.SNAKE,
            previousBody: this.gameState.snake.head,
            growth: foodEaten,
        }
        this.gameState.map[newHeadCoordinateString] = newHeadCell
        this.gameState.snake.head = newHeadCoordinateString
    }

    private updateTail(): void {
        const tailCell = this.gameState.map[this.gameState.snake.tail] as SnakeCell
        if (tailCell?.growth) {
            // If the tail cell is marked for growth, we don't remove it and mark to remove it next iteration
            tailCell.growth = false
        } else {
            // Move the tail forward and remove the old tail
            const newTail = tailCell.previousBody!
            delete this.gameState.map[this.gameState.snake.tail]
            this.gameState.snake.tail = newTail
        }
    }

    private createFailureResult(action: Directions, result: ActionResult): GameStateUpdateResult {
        return {
            newGameState: structuredClone(this.gameState),
            action,
            result,
        }
    }
}
