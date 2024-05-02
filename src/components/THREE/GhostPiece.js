import { useEffect } from "react";
import { PLAYER1 } from "./Board";
import { PLAYER1GEOSTR, PLAYER2GEOSTR } from "./Scene";
import { SCENE_CONSTS } from "./Pieces";

export default function GhostPiece({materials, nodes, ghostRef, state}) {
  // ################ GHOST PIECE 
  const ghostBlackMat = materials.BlackPiece.clone()
  ghostBlackMat.transparent = true; ghostBlackMat.opacity = 0.3;
  const ghostWhiteMat = materials.WhitePiece.clone()
  ghostWhiteMat.transparent = true; ghostWhiteMat.opacity = 0.3;
 
  useEffect(() => {
    if (ghostRef.current == null) return;

    const playerString = state.player == PLAYER1 ? PLAYER1GEOSTR : PLAYER2GEOSTR
    ghostRef.current.position.x = SCENE_CONSTS.boardWidth - state.pos[0] * SCENE_CONSTS.boardWidthDif
    ghostRef.current.position.y = SCENE_CONSTS.pieceHeights[state.piece - 1]
    ghostRef.current.position.z = SCENE_CONSTS.boardDepth - state.pos[1] * SCENE_CONSTS.boardDepthDif
    ghostRef.current.material = state.player == PLAYER1 ? ghostWhiteMat : ghostBlackMat
    ghostRef.current.geometry = nodes[`${playerString}${state.piece}`].geometry

    ghostRef.current.visible = state.visible
  }, [state])

  return (<>
  <group>
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
  </group>
  </>)
}