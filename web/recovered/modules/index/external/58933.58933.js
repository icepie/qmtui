(n) => {
      "use strict";
      n.exports = {
        ...require("electron"),
        remote: require("@electron/remote"),
      };
    }