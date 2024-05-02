import { useEffect, useState } from "react";
import { Outlines } from '@react-three/drei'
import { PLAYER1 } from "./Board";
import { PLAYER1GEOSTR, PLAYER2GEOSTR } from "./Scene";

export const SCENE_CONSTS = {
  'pieceHeights': [1.181, 1.326, 1.399, 1.417],
  'boardWidth': 1.55,
  'boardDepth': 1.55,
  'boardWidthDif': 1.035,
  'boardDepthDif': 1.035,
  'boardHeight': 0.85
}


export const Piece = (props) => {
  const {positionXYZ, geometry, ignoreHover, material, onClick, selected} = props

  const [hover, setHover] = useState(false)

  return ( <>
    <mesh
      castShadow
      receiveShadow
      onClick={onClick}
      onPointerEnter={(e) => {e.stopPropagation(); setHover(!ignoreHover && true);}}
      onPointerLeave={(e) => {e.stopPropagation(); setHover(false);}}
      geometry={geometry}
      position={positionXYZ}
      material={material}
    >
      <Outlines visible={selected || hover} thickness={0.03} color={selected ? 'orange' : 'blue'}/>
    </mesh>
  </>)
}

export const StackPiece = (props) => {
  const {threeInfo, stackInfo, onClick, selected} = props

  const player = stackInfo.player
  const piece = stackInfo.playerStacks[player][stackInfo.index]

  const getMaterial = (player) => player == PLAYER1 ? threeInfo.materials.WhitePiece : threeInfo.materials.BlackPiece
  const getGeometry = (player, piece) => threeInfo.nodes[`${player == PLAYER1 ? PLAYER1GEOSTR : PLAYER2GEOSTR}${piece}`].geometry

  if (piece == 0) {
    return <></>
  }

  const positionXZ = [-1.2 +(1.2 * stackInfo.index), player == PLAYER1 ? 3.1 : -3.1]
  return <Piece 
    ignoreHover={stackInfo.playerTurn !== player}
    positionXYZ={[positionXZ[0], SCENE_CONSTS.pieceHeights[piece - 1] - 0.8, positionXZ[1]]} 
    geometry={getGeometry(player, piece)} 
    onClick={onClick} 
    material={getMaterial(player)} 
    selected={selected}/>
}