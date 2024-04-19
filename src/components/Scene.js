/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useEffect, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function Scene(props) {
  const { nodes, materials } = useGLTF('/bobblet.glb')
  
  const pieceHeights = [1.181, 1.326, 1.399, 1.417]
  const boardWidth = 1.55; const boardDepth = 1.55;
  const boardWidthDif = 1.035; const boardDepthDif = 1.035
  const boardHeight = 0.85

  const playerStacks = [[4, 4, 4], [4, 4, 4]]

  const Piece = ({positionXZ, player, piece}) => {
    const playerString = player == 0 ? 'White' : 'Black'
    return ( <>
      {piece > 0 && <mesh
        castShadow
        receiveShadow
        geometry={nodes[`${playerString}${piece}`].geometry}
        material={player == 0 ? materials.WhitePiece : materials.BlackPiece}
        position={[positionXZ[0], pieceHeights[piece - 1] - 0.8, positionXZ[1]]}
      />}
    </>)
  }

  const ghostRef = useRef()
  const ghostBlackMat = materials.BlackPiece.clone()
  ghostBlackMat.transparent = true; ghostBlackMat.opacity = 0.3;
  const ghostWhiteMat = materials.WhitePiece.clone()
  ghostWhiteMat.transparent = true; ghostWhiteMat.opacity = 0.3;

  // used to show a hover ghost on placement
  const updateGhostPlacement = (positionXZ, player, piece) => {
    if (ghostRef.current == null) {
      return;
    }
    const playerString = player == 0 ? 'White' : 'Black'
    
    ghostRef.current.visible = true
    // can't set position but need to set x,y,z
    ghostRef.current.position.x = positionXZ[0]
    ghostRef.current.position.y = pieceHeights[piece - 1]
    ghostRef.current.position.z = positionXZ[1]
    ghostRef.current.material = player == 0 ? ghostWhiteMat : ghostBlackMat
    ghostRef.current.geometry = nodes[`${playerString}${piece}`].geometry
  }
  const hideGhost = () => {
    if (ghostRef.current == null) return;
    ghostRef.current.visible = false
  }

  // make buttons (boxes) for each board cell
  const createButtons = () => {
    const buttons = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        buttons.push(
          <mesh 
            key={`${i} ${j}`} 
            position={new THREE.Vector3(boardWidth - i * boardWidthDif, boardHeight, boardDepth - j * boardDepthDif)}
            onClick={(e) => {
              e.stopPropagation()
              console.log(`${i} ${j}`);
            }}
            onPointerEnter={(e) => updateGhostPlacement([boardWidth - i * boardWidthDif, boardDepth - j * boardDepthDif], 0, 4)}
            onPointerLeave={(e) => hideGhost()}
            visible={false}
          >
            <boxGeometry args={[0.75,0.1,0.75]}/>
          </mesh>
        )
      }
    }
    return buttons
  }
    
  return (
    <group {...props} dispose={null}>
      <mesh
        className={"GhostPiece"}
        castShadow
        receiveShadow
        visible={false}
        ref={ghostRef}
        geometry={nodes.Black1.geometry}
        material={ghostWhiteMat}
        position={[-1.542, 1.181, -1.535]}
        />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Board.geometry}
        material={materials.Board}
        position={[0, 0.409, 0]}
        />
      <group>
        {createButtons()}
      </group>
      {/* <mesh castShadow receiveShadow geometry={nodes.Table.geometry} material={materials.Table} /> */}
      <Piece positionXZ={[-1.2, 3.1]} player={0} piece={playerStacks[0][0]}/>
      <Piece positionXZ={[0, 3.1]} player={0} piece={playerStacks[0][1]}/>
      <Piece positionXZ={[1.2, 3.1]} player={0} piece={playerStacks[0][2]}/>

      <Piece positionXZ={[-1.2, -3.1]} player={1} piece={playerStacks[1][0]}/>
      <Piece positionXZ={[0, -3.1]} player={1} piece={playerStacks[1][1]}/>
      <Piece positionXZ={[1.2, -3.1]} player={1} piece={playerStacks[1][2]}/>
    </group>
  )
}

useGLTF.preload('/bobblet.glb')