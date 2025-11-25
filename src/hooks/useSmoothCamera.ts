"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RefObject, useRef } from "react";

export interface CameraMoveRequest {
  position: [number, number, number];
  target: [number, number, number];
}

export default function useSmoothCamera(
  moveRequest: CameraMoveRequest | null,
  onFinish: () => void,
  controlsRef: RefObject<any>
) {
  const { camera } = useThree();
  const lerpProgress = useRef(0);

  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());

  const endPos = useRef(new THREE.Vector3());
  const endTarget = useRef(new THREE.Vector3());

  const isMoving = useRef(false);

  useFrame(() => {
    // Abort previous animation if a new request is received
    if (moveRequest && isMoving.current === false) {
      isMoving.current = true;
      lerpProgress.current = 0;

      // Immediately re-enable controls if they were stuck disabled
      if (controlsRef.current) controlsRef.current.enabled = false;

      startPos.current.copy(camera.position);
      startTarget.current.copy(
        controlsRef.current?.target || new THREE.Vector3()
      );

      endPos.current.set(...moveRequest.position);
      endTarget.current.set(...moveRequest.target);
    }

    if (isMoving.current) {
      lerpProgress.current += 0.04; // speed factor

      // Smoothstep progress
      let t = lerpProgress.current;
      t = t * t * (3 - 2 * t);

      camera.position.lerpVectors(startPos.current, endPos.current, t);

      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(
          startTarget.current,
          endTarget.current,
          t
        );
        controlsRef.current.update();
      }

      // Done
      if (lerpProgress.current >= 1) {
        isMoving.current = false;

        // Re-enable controls
        if (controlsRef.current) {
          controlsRef.current.enabled = true;

          // Reset orbit pivot to globe center
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }

        onFinish();
      }
    }
  });
}
