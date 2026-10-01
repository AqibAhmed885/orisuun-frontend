"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { universalCommunityChatFocusedSection } from "@/data/marketing/universalAndCommunityChat";

const roomLabels = [
  "Mentor Circle",
  "Funding Room",
  "Marketing Room",
  "Investor Q&A",
  "Founder Chat",
] as const;

type RoomLabel = (typeof roomLabels)[number];
type CellValue = RoomLabel | null | "__space__";

type BoxRow = {
  columns: string;
  cells: CellValue[];
};

type Slot = {
  rowIndex: number;
  cellIndex: number;
};

type ActiveRoom = {
  label: RoomLabel;
  slot: Slot;
  version: number;
};

type RoomTransition = {
  from: ActiveRoom;
  to: ActiveRoom;
};

type RoomGridState = {
  activeRooms: ActiveRoom[];
  transition: RoomTransition | null;
};

type RoomCellState = {
  room: ActiveRoom;
  phase: "stable" | "incoming" | "outgoing";
};

const ACTIVE_ROOM_COUNT = 4;
const TRANSITION_DURATION = 1500;
const FLOW_PAUSE = 550;
const INITIAL_DELAY = 800;

const boxRows: BoxRow[] = [
  {
    columns: "repeat(6, minmax(0, 1fr))",
    cells: [null, null, null, "Mentor Circle", null, null],
  },
  {
    columns: "0.5fr repeat(5, minmax(0, 1fr)) 0.5fr",
    cells: ["__space__", null, "Funding Room", "Marketing Room", null, null, null],
  },
  {
    columns: "repeat(6, minmax(0, 1fr))",
    cells: [null, "Investor Q&A", null, null, "Founder Chat", null],
  },
  {
    columns: "repeat(6, minmax(0, 1fr))",
    cells: [null, null, null, null, null, null],
  },
];

const mobileBoxRows: CellValue[][] = [
  [null, "Mentor Circle"],
  ["Funding Room", null],
  [null, "Investor Q&A"],
  [null, null],
  ["Marketing Room", "Founder Chat"],
];

function areSameSlot(a: Slot, b: Slot) {
  return a.rowIndex === b.rowIndex && a.cellIndex === b.cellIndex;
}

function getSlotsFromDesktopRows(rows: BoxRow[]): Slot[] {
  const slots: Slot[] = [];

  rows.forEach((row, rowIndex) => {
    row.cells.forEach((cell, cellIndex) => {
      if (cell !== "__space__") {
        slots.push({ rowIndex, cellIndex });
      }
    });
  });

  return slots;
}

function getSlotsFromMobileRows(rows: CellValue[][]): Slot[] {
  const slots: Slot[] = [];

  rows.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell !== "__space__") {
        slots.push({ rowIndex, cellIndex });
      }
    });
  });

  return slots;
}

function getInitialActiveRoomsFromDesktopRows(rows: BoxRow[]): ActiveRoom[] {
  const activeRooms: ActiveRoom[] = [];

  rows.forEach((row, rowIndex) => {
    row.cells.forEach((cell, cellIndex) => {
      if (cell && cell !== "__space__" && activeRooms.length < ACTIVE_ROOM_COUNT) {
        activeRooms.push({
          label: cell,
          slot: { rowIndex, cellIndex },
          version: 0,
        });
      }
    });
  });

  return activeRooms;
}

function getInitialActiveRoomsFromMobileRows(rows: CellValue[][]): ActiveRoom[] {
  const activeRooms: ActiveRoom[] = [];

  rows.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell && cell !== "__space__" && activeRooms.length < ACTIVE_ROOM_COUNT) {
        activeRooms.push({
          label: cell,
          slot: { rowIndex, cellIndex },
          version: 0,
        });
      }
    });
  });

  return activeRooms;
}

function getRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function getAvailableSlots(slots: Slot[], activeRooms: ActiveRoom[], movingIndex: number) {
  return slots.filter((slot) => {
    const usedByOtherRoom = activeRooms.some((room, index) => {
      return index !== movingIndex && areSameSlot(room.slot, slot);
    });

    const sameAsCurrent = areSameSlot(activeRooms[movingIndex].slot, slot);

    return !usedByOtherRoom && !sameAsCurrent;
  });
}

function getNextLabel(activeRooms: ActiveRoom[], movingIndex: number) {
  const currentLabel = activeRooms[movingIndex].label;

  const activeLabelsExceptCurrent = activeRooms
    .filter((_, index) => index !== movingIndex)
    .map((room) => room.label);

  const inactiveLabels = roomLabels.filter(
    (label) => !activeLabelsExceptCurrent.includes(label)
  );

  if (!inactiveLabels.length) return currentLabel;

  const shouldSwitchLabel = Math.random() > 0.45;

  return shouldSwitchLabel ? getRandomItem(inactiveLabels) : currentLabel;
}

function moveOneRoom(
  activeRooms: ActiveRoom[],
  slots: Slot[],
  movingIndex: number
): ActiveRoom[] {
  if (!activeRooms.length) return activeRooms;

  const safeMovingIndex = movingIndex % activeRooms.length;
  const availableSlots = getAvailableSlots(slots, activeRooms, safeMovingIndex);

  if (!availableSlots.length) return activeRooms;

  const nextRooms = [...activeRooms];

  nextRooms[safeMovingIndex] = {
    label: getNextLabel(activeRooms, safeMovingIndex),
    slot: getRandomItem(availableSlots),
    version: activeRooms[safeMovingIndex].version + 1,
  };

  return nextRooms;
}

function getRoomCellState(
  gridState: RoomGridState,
  rowIndex: number,
  cellIndex: number
): RoomCellState | null {
  const { activeRooms, transition } = gridState;

  if (
    transition &&
    transition.from.slot.rowIndex === rowIndex &&
    transition.from.slot.cellIndex === cellIndex
  ) {
    return { room: transition.from, phase: "outgoing" };
  }

  const room = activeRooms.find((activeRoom) => {
    return activeRoom.slot.rowIndex === rowIndex && activeRoom.slot.cellIndex === cellIndex;
  });

  if (!room) return null;

  const isIncoming =
    transition &&
    transition.to.slot.rowIndex === rowIndex &&
    transition.to.slot.cellIndex === cellIndex;

  return { room, phase: isIncoming ? "incoming" : "stable" };
}

const desktopSlots = getSlotsFromDesktopRows(boxRows);
const mobileSlots = getSlotsFromMobileRows(mobileBoxRows);

const initialDesktopRooms = getInitialActiveRoomsFromDesktopRows(boxRows);
const initialMobileRooms = getInitialActiveRoomsFromMobileRows(mobileBoxRows);

export default function FocusedConversationsSection() {
  const desktopStepRef = useRef(0);
  const mobileStepRef = useRef(0);

  const [desktopGrid, setDesktopGrid] = useState<RoomGridState>({
    activeRooms: initialDesktopRooms,
    transition: null,
  });

  const [mobileGrid, setMobileGrid] = useState<RoomGridState>({
    activeRooms: initialMobileRooms,
    transition: null,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    let transitionTimer: number;
    let nextMoveTimer: number;
    let stopped = false;

    const moveNextRoom = () => {
      const desktopMovingIndex = desktopStepRef.current % ACTIVE_ROOM_COUNT;
      const mobileMovingIndex = mobileStepRef.current % ACTIVE_ROOM_COUNT;

      desktopStepRef.current += 1;
      mobileStepRef.current += 1;

      setDesktopGrid((currentGrid) => {
        const nextRooms = moveOneRoom(
          currentGrid.activeRooms,
          desktopSlots,
          desktopMovingIndex
        );

        return {
          activeRooms: nextRooms,
          transition: {
            from: currentGrid.activeRooms[desktopMovingIndex],
            to: nextRooms[desktopMovingIndex],
          },
        };
      });

      setMobileGrid((currentGrid) => {
        const nextRooms = moveOneRoom(
          currentGrid.activeRooms,
          mobileSlots,
          mobileMovingIndex
        );

        return {
          activeRooms: nextRooms,
          transition: {
            from: currentGrid.activeRooms[mobileMovingIndex],
            to: nextRooms[mobileMovingIndex],
          },
        };
      });

      transitionTimer = window.setTimeout(() => {
        if (stopped) return;

        setDesktopGrid((currentGrid) => ({ ...currentGrid, transition: null }));
        setMobileGrid((currentGrid) => ({ ...currentGrid, transition: null }));

        nextMoveTimer = window.setTimeout(moveNextRoom, FLOW_PAUSE);
      }, TRANSITION_DURATION);
    };

    nextMoveTimer = window.setTimeout(moveNextRoom, INITIAL_DELAY);

    return () => {
      stopped = true;
      window.clearTimeout(transitionTimer);
      window.clearTimeout(nextMoveTimer);
    };
  }, []);

  return (
    <section className="relative mx-auto max-w-[1260px] overflow-hidden rounded-2xl bg-[#BAD9FF]">
      <div className="flex min-h-[420px] flex-col px-4 pb-8 pt-8 md:min-h-[730px] md:px-[60px] md:pb-[70px] md:pt-[70px]">
        <div className="mx-auto flex w-full max-w-[260px] flex-col items-center text-center md:max-w-[760px]">
          <h3 className="max-w-[260px] text-center text-[18px] font-medium leading-[100%] text-[#0A1734] md:max-w-[720px] md:text-[42px]">
            {universalCommunityChatFocusedSection.title}
          </h3>

          <p className="mx-auto mt-3 max-w-[260px] text-center text-[10px] tracking-wide text-[#1F3556] md:mt-4 md:max-w-[680px] md:text-base">
            {universalCommunityChatFocusedSection.description}
          </p>

          <Link
            href={universalCommunityChatFocusedSection.ctaHref}
            className="mt-4 inline-flex items-center gap-2 rounded bg-[#071B3A] px-4 py-2 text-[10px] font-semibold text-white transition duration-300 hover:bg-[#0F2A56] md:mt-5 md:px-5 md:py-2.5 md:text-sm"
          >
            {universalCommunityChatFocusedSection.ctaLabel}
            <span aria-hidden="true">&raquo;</span>
          </Link>
        </div>

        {/* Mobile animated boxes */}
        <div className="-mx-4 mt-8 overflow-hidden pb-1 md:hidden">
          <div className="flex w-full flex-col gap-[10px]">
            {mobileBoxRows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-2 gap-[10px]">
                {row.map((cell, cellIndex) => {
                  const cellState = getRoomCellState(
                    mobileGrid,
                    rowIndex,
                    cellIndex
                  );
                  const room = cellState?.room;

                  return (
                    <div
                      key={`${rowIndex}-${cellIndex}`}
                      className={`room-cell flex h-[34px] min-w-0 items-center rounded-[4px] px-[8px] ${room
                          ? "room-cell-active bg-[#496F8A99] text-[#183453] "
                          : "bg-[rgba(45,70,101,0.05)]"
                        } ${cellState?.phase === "incoming" ? "room-cell-incoming" : ""} ${
                          cellState?.phase === "outgoing" ? "room-cell-outgoing" : ""
                        }`}
                    >
                      {room ? (
                        <div
                          key={`${room.label}-${room.version}-${cellState?.phase}`}
                          className="room-content flex min-w-0 items-center"
                        >
                          <span className="mr-[7px] h-6 w-6 shrink-0 rounded-[3px] bg-[#89AAC7]" />
                          <span className="truncate text-[11px] leading-none">
                            {room.label}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop animated boxes */}
        <div className="-mx-4 mt-8 hidden w-[calc(100%+32px)] overflow-hidden pb-1 pt-20 md:-mx-[60px] md:block md:w-[calc(100%+120px)]">
          <div className="w-full">
            <div className="flex w-full flex-col gap-[8px] md:gap-[10px]">
              {boxRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid gap-[8px] md:gap-[10px] "
                  style={{ gridTemplateColumns: row.columns }}
                >
                  {row.cells.map((cell, cellIndex) => {
                    if (cell === "__space__") {
                      return <div key={`${rowIndex}-${cellIndex}`} />;
                    }

                    const cellState = getRoomCellState(
                      desktopGrid,
                      rowIndex,
                      cellIndex
                    );
                    const room = cellState?.room;

                    return (
                      <div
                        key={`${rowIndex}-${cellIndex}`}
                        className={`room-cell flex h-[48px] items-center rounded-[4px] px-[6px] md:h-[50px] md:rounded-[6.51px] md:px-[10px] ${room
                          ? "room-cell-active bg-[#496F8A99] text-[#161E31C9] "
                            : "bg-[rgba(45,70,101,0.05)]"
                          } ${cellState?.phase === "incoming" ? "room-cell-incoming" : ""} ${
                            cellState?.phase === "outgoing" ? "room-cell-outgoing" : ""
                          }`}
                        
                      >
                        {room ? (
                          <div
                            key={`${room.label}-${room.version}-${cellState?.phase}`}
                            className="room-content flex min-w-0 items-center"
                          >
                            <span className="mr-[6px] h-3 w-3 shrink-0 rounded-[2px] bg-[#89AAC7] md:mr-[10px] md:h-6 md:w-6 md:rounded-[4px]" />
                            <span className="truncate text-[9px] leading-none md:text-lg">
                              {room.label}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .room-cell {
          transform: translateZ(0) scale(1);
          will-change: transform, opacity, background-color, box-shadow, filter;
        }

        .room-cell-incoming {
          animation: roomCellFadeIn ${TRANSITION_DURATION}ms
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .room-cell-outgoing {
          animation: roomCellFadeOut ${TRANSITION_DURATION}ms
            cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        .room-cell-incoming .room-content {
          animation: roomTextFadeIn ${TRANSITION_DURATION}ms ease-in-out both;
        }

        .room-cell-outgoing .room-content {
          animation: roomTextFadeOut ${TRANSITION_DURATION}ms ease-in-out both;
        }

        .room-content {
          will-change: transform, opacity, filter;
        }

        @keyframes roomCellFadeIn {
          0% {
            background-color: rgba(45, 70, 101, 0.05);
            box-shadow: none;
            transform: translateZ(0) scale(0.985);
          }

          45% {
            background-color: rgba(73, 111, 138, 0.25);
            box-shadow: 0 3px 10px rgba(20, 40, 70, 0.06);
            transform: translateZ(0) scale(0.99);
          }

          100% {
            background-color: rgba(73, 111, 138, 0.6);
            box-shadow: 0 8px 22px rgba(20, 40, 70, 0.16);
            transform: translateZ(0) scale(1);
          }
        }

        @keyframes roomCellFadeOut {
          0% {
            background-color: rgba(73, 111, 138, 0.6);
            box-shadow: 0 8px 22px rgba(20, 40, 70, 0.16);
            transform: translateZ(0) scale(1);
          }

          55% {
            background-color: rgba(73, 111, 138, 0.22);
            box-shadow: 0 2px 8px rgba(20, 40, 70, 0.05);
            transform: translateZ(0) scale(0.992);
          }

          100% {
            background-color: rgba(45, 70, 101, 0.05);
            box-shadow: none;
            transform: translateZ(0) scale(0.985);
          }
        }

        @keyframes roomTextFadeIn {
          0% {
            opacity: 0;
            transform: translateY(5px);
            filter: blur(1px);
          }

          38% {
            opacity: 0.12;
          }

          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes roomTextFadeOut {
          0% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }

          62% {
            opacity: 0.18;
          }

          100% {
            opacity: 0;
            transform: translateY(-4px);
            filter: blur(1px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .room-cell-incoming,
          .room-cell-outgoing,
          .room-cell-incoming .room-content,
          .room-cell-outgoing .room-content {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
