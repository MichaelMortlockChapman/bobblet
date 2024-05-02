import { CameraControls, Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Scene } from "./Scene"
import { useImmer } from "use-immer"

export const PLAYER1 = 0
export const PLAYER2 = 1
export const PLAYER1STACK = PLAYER1
export const PLAYER2STACK = PLAYER2
export const NONESELECTED = -3

export const boardDim = 4
const initBoard = () => {
  const board = []
  for (let i = 0; i < boardDim; i++) {
    const row = []
    for (let j = 0; j < boardDim; j++) {
      row.push([])
    }
    board.push(row)
  }
  return board
}

export const getTopValue = (itemArr) => {
  if (itemArr.length > 0 && itemArr[itemArr.length - 1] !== undefined) {
    return itemArr[itemArr.length - 1]
  } else {
    return undefined
  }
}

const getTopPlayerValue = (itemArr) => {
  const topValue = getTopValue(itemArr)
  if (topValue === undefined) {
    return undefined;
  } else {
    return topValue.player
  }
}

const getTopTypeValue = (itemArr) => {
  const topValue = getTopValue(itemArr)
  if (topValue === undefined) {
    return undefined;
  } else {
    return topValue.type
  }
}

export default function Board() {
  const [board, setBoard] = useImmer(initBoard())
  const [won, setWon] = useState("-1")
  const [playerStacks, setPlayerStacks] = useState([[4, 3, 2], [1, 2, 4]])
  const [playerTurn, setPlayerTurn] = useState(PLAYER1);
  const [selected, setSelected] = useState([-1, 1])

  const getPlayerStackId = () => playerTurn === PLAYER1 ? PLAYER1STACK : PLAYER2STACK
  const handleSelectStackPiece = (stackId) => {
    if (playerStacks[getPlayerStackId()][stackId] === 0) {
      return;
    }
    // using negative ints to represent additional info i.e -3 is unselected, -1 is Player 1's stack, -2 is Player 2's stack
    setSelected([-(getPlayerStackId() + 1), stackId])
  }

  const placementAction = (i,j) => {
    // check piece from player stack
    if (selected[0] === -(PLAYER1STACK + 1) || selected[0] === -(PLAYER2STACK + 1)) {
      const pieceType = playerStacks[-(selected[0] + 1)][selected[1]]
      console.log(pieceType);
      // check cell empty or top piece (biggest) is smaller than piece to place
      if ((board[i][j].length === 0)
        || getTopTypeValue(board[i][j]) < pieceType
      ) {
        const newPiece = {"type": pieceType, "player": playerTurn}
        setPlayerStacks(playerStacks => playerStacks)
        setPlayerTurn(playerTurn === PLAYER1 ? PLAYER2 : PLAYER1)
        setBoard(draft => {
          draft[i][j].push(newPiece)
        })
        playerStacks[-(selected[0] + 1)][selected[1]]--
        setSelected([NONESELECTED, NONESELECTED])
      }
    } else { // moving piece from board
      const pieceType = getTopTypeValue(board[selected[0]][selected[1]])
      console.log(pieceType);
      if ((board[i][j].length === 0)
        || getTopTypeValue(board[i][j]) < pieceType
      ) {
        const newPiece = {"type": pieceType, "player": playerTurn}
        setPlayerTurn(playerTurn === PLAYER1 ? PLAYER2 : PLAYER1)
        setBoard(draft => {
          draft[selected[0]][selected[1]].pop()
          draft[i][j].push(newPiece)
        })
        setSelected([NONESELECTED, NONESELECTED])
      }
    }
  }

  const buttonAction = (i,j) => {
    if (selected[0] !== NONESELECTED) {
      placementAction(i,j);
    } else if (getTopPlayerValue(board[i][j]) !== undefined && getTopPlayerValue(board[i][j]) === playerTurn) {
      setSelected([i, j])
    }
  }

  // check win conditions on board update
  useEffect(() => {
    for (let i = 0; i < boardDim; i++) {
      if (getTopPlayerValue(board[i][0]) !== undefined
        && getTopPlayerValue(board[i][0]) === getTopPlayerValue(board[i][1])
        && getTopPlayerValue(board[i][1]) === getTopPlayerValue(board[i][2])
        && getTopPlayerValue(board[i][2]) === getTopPlayerValue(board[i][3])
      ) {
        setWon(getTopPlayerValue(board[i][0]))
        return;
      } else if (getTopPlayerValue(board[0][i]) !== undefined
        && getTopPlayerValue(board[0][i]) === getTopPlayerValue(board[1][i])
        && getTopPlayerValue(board[1][i]) === getTopPlayerValue(board[2][i])
        && getTopPlayerValue(board[2][i]) === getTopPlayerValue(board[3][i])
      ) {
        setWon(getTopPlayerValue(board[0][i]))
        return;
      }
    }

    if (getTopPlayerValue(board[0][0]) !== undefined
        && getTopPlayerValue(board[0][0]) === getTopPlayerValue(board[1][1])
        && getTopPlayerValue(board[1][1]) === getTopPlayerValue(board[2][2])
        && getTopPlayerValue(board[2][2]) === getTopPlayerValue(board[3][3])
    ) {
      setWon(getTopPlayerValue(board[0][0]))
      return;
    }

    if (getTopPlayerValue(board[3][0]) !== undefined
        && getTopPlayerValue(board[3][0]) === getTopPlayerValue(board[2][1])
        && getTopPlayerValue(board[2][1]) === getTopPlayerValue(board[1][2])
        && getTopPlayerValue(board[1][2]) === getTopPlayerValue(board[0][3])
    ) {
      setWon(getTopPlayerValue(board[3][0]))
      return;
    }
  }, [board])

  useEffect(() => {
    console.log(won);
  }, [won])

  return (
    <div style={{width: '100vw', height: '100vh', position: 'absolute'}}>
      <Canvas dpr={2}>
        <Suspense fallback={null}>
          <Environment preset="sunset" background/>
          <PerspectiveCamera makeDefault position={[0,5,5]} rotation={new THREE.Vector3(0, 0, Math.Pi /4)}/>
          <OrbitControls/>
          <Scene handleCellAction={buttonAction} board={board} selected={selected} handleSelectStackPiece={handleSelectStackPiece} playerStacks={playerStacks} playerTurn={playerTurn}/>
        </Suspense>
      </Canvas>

      <div style={{position: 'absolute', top: 0, left: 10, backgroundColor: 'white', padding: '10px'}}>
        <p>{playerTurn}</p>
        <p>{`[${selected[0]}, ${selected[1]}]`}</p>
        <p>{`[[${playerStacks[0][0]}, ${playerStacks[0][1]}, ${playerStacks[0][2]}], [${playerStacks[1][0]}, ${playerStacks[1][1]}, ${playerStacks[1][2]}]}`}</p>
      </div>
    </div>
  )
}