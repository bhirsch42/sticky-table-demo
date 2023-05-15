/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.scss";
import * as R from "ramda";
import { faker } from "@faker-js/faker";
import React from "react";

const GROUPS_COUNT = 10;
const COLUMN_COUNT = 20;
const ROWS_PER_GROUP_COUNT = 10;
const DISABLE_SYNC_SCROLL = false;

const columnWidths = R.times(
  () => Math.ceil(Math.random() * 3) * 2 + 10,
  COLUMN_COUNT
);

const columnWidthStyles = columnWidths.map(
  (columnWidth) => `${columnWidth}rem`
);
const totalColumnWidth = R.sum(columnWidths);
const totalColumnWidthStyle = `${totalColumnWidth}rem`;

function TableHeader() {
  return (
    <div className="table-head" style={{ width: totalColumnWidthStyle }}>
      {columnWidthStyles.map((width, i) => (
        <div className="table-head-cell" style={{ width }} key={i}>
          {faker.animal.dog()}
        </div>
      ))}
    </div>
  );
}

function TableRow() {
  return (
    <div className="table-row" style={{ width: totalColumnWidthStyle }}>
      {columnWidthStyles.map((width, i) => (
        <div className="table-cell" style={{ width }} key={i}>
          {faker.person.fullName()}
        </div>
      ))}
    </div>
  );
}

function TableGroupHeader() {
  return (
    <div className="table-group-header-container">
      <div className="table-group-header">{faker.color.human()}</div>
    </div>
  );
}

function TableGroup() {
  return (
    <div className="table-group">
      {R.times(
        (i) => (
          <TableRow key={i} />
        ),
        ROWS_PER_GROUP_COUNT
      )}
    </div>
  );
}

function TableWithSingleScrollContainer() {
  return (
    <div className="table-with-single-scroll-container">
      <div className="scroll-container">
        <TableHeader />
        {R.times(
          (i) => (
            <React.Fragment key={i}>
              <TableGroupHeader />
              <TableGroup />
            </React.Fragment>
          ),
          ROWS_PER_GROUP_COUNT
        )}
      </div>
    </div>
  );
}

function TableWithMultipleScrollContainers() {
  const tableRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const tableEl = tableRef.current;
    if (DISABLE_SYNC_SCROLL || !tableEl) return;

    const scrollContainerEls =
      tableEl.querySelectorAll(".scroll-container") || [];

    let raf: number;

    const handleScroll: EventListener = (e) => {
      if (!e.target) return;
      if (raf) cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const scrollTarget: Element = e.target as HTMLDivElement;
        const scrollX = scrollTarget.scrollLeft;

        scrollContainerEls.forEach((scrollContainerEl) => {
          if (scrollContainerEl === e.target) return;
          return (scrollContainerEl.scrollLeft = scrollX);
        });
      });
    };

    scrollContainerEls.forEach((scrollContainer) => {
      scrollContainer.addEventListener("scroll", handleScroll);
    });

    return () => {
      scrollContainerEls.forEach((scrollContainer) => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      });
    };
  }, [tableRef]);

  return (
    <div className="table-with-multiple-scroll-containers" ref={tableRef}>
      <div className="scroll-container sticky -top-1">
        <TableHeader />
      </div>
      {R.times(
        (i) => (
          <React.Fragment key={i}>
            <TableGroupHeader />
            <div className="scroll-container">
              <TableGroup />
            </div>
          </React.Fragment>
        ),
        ROWS_PER_GROUP_COUNT
      )}
    </div>
  );
}

function App() {
  return (
    <>
      <div>
        <h1>Hello, world!</h1>
        <TableWithSingleScrollContainer />
        {/* <TableWithMultipleScrollContainers /> */}
      </div>
    </>
  );
}

export default App;
