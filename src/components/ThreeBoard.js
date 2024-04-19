import { CameraControls, Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import * as THREE from "three"
import { Scene } from "./Scene"

function RotatingBox () {
  const myMesh = useRef()
  useFrame(({clock}) => {
    myMesh.current.rotation.x = Math.sin(clock.getElapsedTime())
  })

  return (
    <mesh ref={myMesh} position={new THREE.Vector3(0,2,0)}>
      <boxGeometry args={[2,2,2]}/>
      <meshStandardMaterial/>
    </mesh>
  )
}

export default function ThreeBoard() {
  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <Canvas 
        // camera={{
        //   position: [0, 5, 5],
        //   rotation: new THREE.Vector3(0, 0, Math.Pi /4)
        // }}
        dpr={2}
      >
        <Suspense fallback={null}>
          <Environment preset="sunset" background/>
          <PerspectiveCamera makeDefault position={[0,5,5]} rotation={new THREE.Vector3(0, 0, Math.Pi /4)}/>
          <OrbitControls/>
          <Scene/>
          {/* <RotatingBox/> */}
        </Suspense>
      </Canvas>
    </div>
  )
}