import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import YouTube from "react-youtube";

export default function VideoCard({ data, idx }) {
  const [player, setPlayer] = useState(null);
  const [useFullText, setUseFullText] = useState(false);
  const [showLineByLine, setShowLineByLine] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [timedText, setTimedText] = useState(
    data.inner_hits?.timedText?.hits?.hits
  );
  const [fullText, setFullText] = useState(data._source?.timedText);

  const TranscriptArea = () => {
    let items = useFullText ? fullText : timedText;
    if (!useFullText) {
      items = items.map((item) => item._source);
    }
    const listItems = items.map((item, index) => (
      <div className="m-2 w-11/12 justify-between  grid-cols-3 hover:text-stone-400 transition-all duration-150 hover:bg-stone-500 hover:cursor-pointer text-lg  bg-stone-700 p-2 rounded-lg col-span-3 flex flex-row">
      <span
        className=""
        onClick={() => seekTo(item.start)}
      >
        {item.text} {showLineByLine ? <br /> : ""}
      </span>
      <span >
        {seconds(item.start)}
      </span>
      
      </div>
    ));
    return listItems;
  };

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };

  const opts2 = {
    height: "780",
    width: "1280",
    playerVars: {
      autoplay: 0,
    },
  };

  const seconds = (s) => {
    var date = new Date(null);
    date.setSeconds(s); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
  }

  function _onReady(event) {
    // setTimeout(() => {
    //   event.target.pauseVideo();
    // }, 3000);
    // event.target.pauseVideo();
    setPlayer(event.target);
  }

  const seekTo = (time) => {
    if (!player) {
      return;
    }
    player.seekTo(time);
  };

  return (
    <div
      key={data._id}
      className={`
      ${isCollapsed ? "flex-col flex col-span-1" : `col-span-3` }
      border-[1px] border-slate-300 bg-stone-800 max-h-fit
      overflow-y-visible rounded-lg shadow-lg border-opacity-30 
      p-4 mt-6 m-4 flex space-x-4 justify-between 
      transition ease-in-out duration-300
      `}
    >
      {isCollapsed && (
        <div className="flex justify-between">
          <div className="mb-2 text-lg font-semibold">{data._source.title}</div>
          <div className="cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>{">"}</div>
        </div>
      )}
      <YouTube
        videoId={data._id}
        opts={isCollapsed ? opts : opts2}
        onReady={_onReady}
        containerClassName="aspect-w-16 aspect-h-9 shadow-stone-700 shadow-2xl "
      />
      {/* {!isCollapsed &&  */}
      <Transition
        show={!isCollapsed}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className={`flex-grow pl-8 `}
      >
        {/* <div className="flex flex-col border-l-2 m-0 border-slate-100 px-4"> */}
          <div className="mb-2 text-lg font-semibold shadow-stone-700 shadow-2xl">
            {data._source.title}
            <div className="cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>{">"}</div>
          </div>
          <div className="flex text-sm font-medium text-white">
            <div
              className={`p-2 m-2 hover:bg-fuchsia-600 bg-fuchsia-800 hover:cursor-pointer transition-all w-1/4 shadow-lg rounded-md shadow-stone-900 ${
                useFullText ? "bg-fuchsia-500 shadow-inner " : "shadow-md"
              }`}
              onClick={() => setUseFullText(true)}
            >
              Full Transcript
            </div>
            <div
              className={`p-2 m-2 hover:bg-fuchsia-600 bg-fuchsia-800 hover:cursor-pointer transition-all w-1/4 shadow-lg rounded-md shadow-stone-900 ${
                !useFullText ? "bg-fuchsia-500 shadow-inner " : "shadow-md"
              }`}
              onClick={() => setUseFullText(false)}
            >
              Search Results
            </div>
            {/* <div
              className={`p-2 m-2 hover:bg-slate-200 bg-fuchsia-800 hover:cursor-pointer transition-all w-1/4 shadow-lg rounded-md`}
            >
              Remove From History
            </div> */}
          </div>
          <div className="mt-4 text-sm font-normal max-h-[680px] overflow-y-scroll  grid grid-cols-3 scrollbar-thumb-fuchsia-900 scrollbar-track-stone-900 scrollbar-thin border-t-[2px] rounded-tl-sm border-stone-900">
            <TranscriptArea />
          {/* </div> */}
        </div>
      </Transition>
      {/* } */}
    </div>
  );
}
