import { ReactNode, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import './App.scss'
import { GitHubCorner } from './GitHubCorner'
import { PhaserGameComponent } from './PhaserGameComponent'
import { GameScene } from './game/scenes/GameScene'
import { RoundScene } from './game/scenes/RoundScene'

export const App = (): ReactNode => {
    const [gameRunning, setGameRunning] = useState<boolean>(false)
    const [currentScene, setCurrentScene] = useState<Phaser.Scene | undefined>(undefined)

    const startGame = (settings: any) => {
        if (currentScene) {
            console.log('Starting game with settings:', settings)
            setGameRunning(true)
            const gameScene = currentScene as GameScene
            gameScene.startGame(settings)
        }
    }

    const abortGame = () => {
        if (currentScene) {
            setGameRunning(false)
            const roundScene = currentScene as RoundScene
            roundScene.abortGame()
        }
    }

    return (
        <>
            <Container fluid={'md'} id="app" className="p-0 m-0 h-100 border-start border-end border-2">
                <Row
                    className="h-100 g-0 justify-content-center align-items-center">
                    <Col xs={12} sm={6} lg={12} className="phaser-game-container">
                        <PhaserGameComponent onSceneChange={scene => setCurrentScene(scene)} />
                    </Col>
                </Row>
            </Container>
            <GitHubCorner />
        </>
    )
}
