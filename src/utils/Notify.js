
import { useState } from "react";
import { Toast, ToastHeader, ToastBody } from "reactstrap";
import { Icon } from "../components/Component"; 

const Notify = (notify = false, alertType, msg) => {
    const {showNotify,setShowNotify} = useState(notify)
    const toggle = () => {setShowNotify(!showNotify)};
    const alertCss = () => `p-3 my-2 bg-${alertType} rounded`;
    return (
      <div style={{ position: "relative", minHeight: "200px" }} className={alertCss}>
        <div className="toast-container" style={{ position: "absolute", top: 0, right: 0 }}>
          <Toast isOpen={showNotify}>
            <ToastHeader
              close={
                <>
                  <small>2 seconds ago</small>
                  <button className="close" onClick={toggle}>
                    <Icon name="cross-sm" />
                  </button>
                </>
              }
            >
              <strong className="text-primary">{alertType.charAt(0)}</strong>
            </ToastHeader>
            <ToastBody>
              {msg}
            </ToastBody>
          </Toast>
        </div>
      </div>
    )
  }

  export default Notify;