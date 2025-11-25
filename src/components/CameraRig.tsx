"use client";

import useSmoothCamera, { CameraMoveRequest } from "@/hooks/useSmoothCamera";
import { RefObject } from "react";

export default function CameraRig({
  moveRequest,
  onFinish,
  controlsRef
}: {
  moveRequest: CameraMoveRequest | null;
  onFinish: () => void;
  controlsRef: RefObject<any>;
}) {
  useSmoothCamera(moveRequest, onFinish, controlsRef);
  return null;
}
