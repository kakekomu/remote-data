import { Loading, NotAsked } from "@kakekomu/remote-data"
import * as remote from "@kakekomu/remote-data"
import React, { FunctionComponent, useState } from "react"
import { AxiosError } from "axios"

interface Resp {
  args: {
    greeting: string
  }
}

const SimpleTSExample: FunctionComponent = () => {
  const [webData, setWebData] = useState(NotAsked<AxiosError, string>())

  const fetchGreeting = () => {
    // Setting the webData to Loading before starting the request
    setWebData(Loading())

    // The remote.get function is a wrapper around axios' get function.
    // It makes an HTTP get request, and returns a Failure with the error message or a
    // Success with the response object.
    remote
      .get<Resp>("http://httpbin.org/get?greeting=Hello%20World")
      .then(resp => {
        // We could simply set the webData to the response, or do some mapping on it.
        // This time we take the greeting out of the response body.
        setWebData(remote.map(resp, resBody => resBody.args.greeting))
      })
  }

  // We can switch the rendered HTML based on the state of our webData
  switch (webData.type) {
    case "NotAsked": {
      return <button onClick={fetchGreeting}>Fetch</button>
    }
    case "Loading": {
      return <div>Loading...</div>
    }
    case "Failure": {
      // The error field is only available on Failure
      const error = webData.error
      return <div>Error: {error}</div>
    }
    case "Success": {
      // The value field is only available on Success
      const greeting = webData.value
      return <div>{greeting}</div>
    }
  }
}

export default SimpleTSExample
