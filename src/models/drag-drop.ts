// Drag & Drop Interfaces
export interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
  // Allows the drop
  dragOverHandler(event: DragEvent): void;

  // Handles the drop
  dropHandler(event: DragEvent): void;

  // Revert visual update
  dragLeaveHandler(event: DragEvent): void;
}
