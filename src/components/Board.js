import { useEffect, useState } from "react"
import Stack from '@mui/material/Stack';
import {IconButton, Button} from '@mui/material'
import BoardStar from "./BoardStar.js"
import {Square} from "./Pieces.js";
import { useImmer } from "use-immer";

const PLAYER1 = "white"
const PLAYER2 = "black"
const PLAYER1STACK = 0
const PLAYER2STACK = 1
const NONESELECTED = -3

const getCellDLColor = (isDark) => isDark ? 'rgb(77, 45, 24)' : 'rgb(138, 98, 64)'
const FloatItem = (props) => <div {...props} style={{display:'flex', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>{props.children}</div>

const boardDim = 4
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

const Piece4 = (props) => <Square value={4} size="85px" {...props}/>
const Piece3 = (props) => <Square value={3} size="65px" {...props}/>
const Piece2 = (props) => <Square value={2} size="45px" {...props}/>
const Piece1 = (props) => <Square value={1} size="25px" {...props}/>

const CreatePieceSwitch = (pieceType, playerTurn) => {
  switch (pieceType) {
    case 4:
      return <Piece4 color={playerTurn === PLAYER1 ? PLAYER1 : PLAYER2}/>
    case 3:
      return <Piece3 color={playerTurn === PLAYER1 ? PLAYER1 : PLAYER2}/>
    case 2:
      return <Piece2 color={playerTurn === PLAYER1 ? PLAYER1 : PLAYER2}/>
    case 1:
      return <Piece1 color={playerTurn === PLAYER1 ? PLAYER1 : PLAYER2}/>
    default:
      throw new Error(`CreatePiece Function: Bad pieceType ${pieceType}`)
  }
}
const CreatePiece = (pieceType, playerTurn) => {
  return <FloatItem key={pieceType} value={{player: playerTurn, type: pieceType}}>{CreatePieceSwitch(pieceType, playerTurn)}</FloatItem>
}


const getTopValue = (itemArr) => {
  if (itemArr.length > 0 && itemArr[itemArr.length - 1].props !== undefined) {
    return itemArr[itemArr.length - 1].props.value
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
  const [playerStacks, setPlayerStacks] = useState([[4, 4, 4], [4, 4, 4]])
  const [playerTurn, setPlayerTurn] = useState("white");
  const [selected, setSelected] = useState([NONESELECTED, NONESELECTED])

  const getPlayerStackId = () => playerTurn === PLAYER1 ? PLAYER1STACK : PLAYER2STACK
  const handleSelectStackPiece = (stackId) => {
    if (playerStacks[getPlayerStackId()][stackId] === 0) {
      return;
    }
    // using negative ints to represent additional info i.e -3 is unselected, -1 is Player 1's stack, -2 is Player 2's stack
    setSelected([-(getPlayerStackId() + 1), stackId])
  }

  const boardCellStyle = { border: '1px solid black', width: '100px', height: '100px', padding: 1, position: 'relative'}
  const BoardCell = (props) => {
    const {isDark, boardCell} = props;
    const buttonAction = () => {
      // check piece selected
      if (selected[0] !== NONESELECTED) {
        // check piece from player stack
        if (selected[0] === -(PLAYER1STACK + 1) || selected[0] === -(PLAYER2STACK + 1)) {
          const pieceType = playerStacks[-(selected[0] + 1)][selected[1]]
          console.log(pieceType);
          // check cell empty or top piece (biggest) is smaller than piece to place
          if ((board[boardCell[0]][boardCell[1]].length === 0)
            || getTopTypeValue(board[boardCell[0]][boardCell[1]]) < pieceType
          ) {
            const newPiece = CreatePiece(pieceType, playerTurn)
            setPlayerStacks(playerStacks => playerStacks)
            setPlayerTurn(playerTurn === PLAYER1 ? PLAYER2 : PLAYER1)
            setBoard(draft => {
              draft[boardCell[0]][boardCell[1]].push(newPiece)
            })
            playerStacks[-(selected[0] + 1)][selected[1]]--
            setSelected([NONESELECTED, NONESELECTED])
          }
        } else {
          const pieceType = getTopTypeValue(board[selected[0]][selected[1]])
          console.log(pieceType);
          if ((board[boardCell[0]][boardCell[1]].length === 0)
            || getTopTypeValue(board[boardCell[0]][boardCell[1]]) < pieceType
          ) {
            const newPiece = CreatePiece(pieceType, playerTurn)
            setPlayerTurn(playerTurn === PLAYER1 ? PLAYER2 : PLAYER1)
            setBoard(draft => {
              draft[selected[0]][selected[1]].pop()
              draft[boardCell[0]][boardCell[1]].push(newPiece)
            })
            setSelected([NONESELECTED, NONESELECTED])
          }
        }
      } else if (getTopPlayerValue(board[boardCell[0]][boardCell[1]]) !== undefined && getTopPlayerValue(board[boardCell[0]][boardCell[1]]) === playerTurn) {
        setSelected([boardCell[0], boardCell[1]])
      }
    }
    return (<Stack justifyContent={'center'} onClick={buttonAction} style={{ backgroundColor: getCellDLColor(isDark), ...boardCellStyle}}><BoardStar color={getCellDLColor(!isDark)}/>{props.children}</Stack>)
  }
  const BoardCellLight = (props) => <BoardCell isDark={false} {...props}>{props.children}</BoardCell>
  const BoardCellDark = (props) => <BoardCell isDark={true} {...props}>{props.children}</BoardCell>

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

  return (<>
    <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', height: '100vh', flexWrap: 'wrap', flexDirection: 'column', backgroundColor: 'lightgreen' }}>
      <div>
        <Stack direction={"column"} >
          <Stack direction={"row"} >
            <BoardCellLight boardCell={[0,0]}>{board[0][0]}</BoardCellLight>
            <BoardCellDark boardCell={[0,1]}>{board[0][1]}</BoardCellDark>
            <BoardCellLight boardCell={[0,2]}>{board[0][2]}</BoardCellLight>
            <BoardCellDark boardCell={[0,3]}>{board[0][3]}</BoardCellDark>
          </Stack>
          <Stack direction={"row"} >
            <BoardCellDark boardCell={[1,0]}>{board[1][0]}</BoardCellDark>
            <BoardCellLight boardCell={[1,1]}>{board[1][1]}</BoardCellLight>
            <BoardCellDark boardCell={[1,2]}>{board[1][2]}</BoardCellDark>
            <BoardCellLight boardCell={[1,3]}>{board[1][3]}</BoardCellLight>
          </Stack>
          <Stack direction={"row"} >
            <BoardCellLight boardCell={[2,0]}>{board[2][0]}</BoardCellLight>
            <BoardCellDark boardCell={[2,1]}>{board[2][1]}</BoardCellDark>
            <BoardCellLight boardCell={[2,2]}>{board[2][2]}</BoardCellLight>
            <BoardCellDark boardCell={[2,3]}>{board[2][3]}</BoardCellDark>
          </Stack>
          <Stack direction={"row"} >
            <BoardCellDark boardCell={[3,0]}>{board[3][0]}</BoardCellDark>
            <BoardCellLight boardCell={[3,1]}>{board[3][1]}</BoardCellLight>
            <BoardCellDark boardCell={[3,2]}>{board[3][2]}</BoardCellDark>
            <BoardCellLight boardCell={[3,3]}>{board[3][3]}</BoardCellLight>
          </Stack>
        </Stack>
      </div>
      <Stack direction={"row"} justifyContent={'center'} height={"100px"}>
        {playerStacks[getPlayerStackId(playerTurn)][0] > 0 && <IconButton size="large" onClick={() => handleSelectStackPiece(0)}>{CreatePieceSwitch(playerStacks[getPlayerStackId(playerTurn)][0], playerTurn)}</IconButton>}
        {playerStacks[getPlayerStackId(playerTurn)][1] > 0 && <IconButton size="large" onClick={() => handleSelectStackPiece(1)}>{CreatePieceSwitch(playerStacks[getPlayerStackId(playerTurn)][1], playerTurn)}</IconButton>}
        {playerStacks[getPlayerStackId(playerTurn)][2] > 0 && <IconButton size="large" onClick={() => handleSelectStackPiece(2)}>{CreatePieceSwitch(playerStacks[getPlayerStackId(playerTurn)][2], playerTurn)}</IconButton>}
      </Stack>
      <Button onClick={() => setSelected([NONESELECTED, NONESELECTED])}>Unselect</Button>
      {/* <p>{playerStacks[getPlayerStackId(playerTurn)]}</p> */}
      {/* <p>{playerTurn}</p> */}
      <p>winner: {won}</p>
    </div>
  </>)
}