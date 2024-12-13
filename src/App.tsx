import React from 'react';
import * as WebDataRocks from "@webdatarocks/react-webdatarocks";
import "@webdatarocks/webdatarocks/webdatarocks.min.css";
import './App.css';

const App: React.FC = () => {

  const ref: React.RefObject<WebDataRocks.Pivot> = React.useRef<WebDataRocks.Pivot>(null);   

  const onReportComplete = () => {
    if (ref.current) {
      ref.current.webdatarocks.off("reportcomplete");
      console.log(ref.current.webdatarocks);
    }
  }
  
  return (
    <div className="App">
      <WebDataRocks.Pivot 
        ref={ref} 
        toolbar={true} 
        width="100%" 
        height="1800px"
        reportcomplete={() => onReportComplete()} 
        report="https://jsonhost.com/json/8267e6b68927b715d780c40c246158ea">
      </WebDataRocks.Pivot>
    </div>
  );
}

export default App;
