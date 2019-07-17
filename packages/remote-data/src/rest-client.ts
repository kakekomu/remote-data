import axios, { AxiosError, AxiosResponse } from "axios"
import { useState } from "react"
import {
  AsyncRemoteData,
  Failure,
  isNotAsked,
  Loading,
  NotAsked,
  RemoteData,
  Success
} from "./remote-data"

type HTTPMethod = "get" | "post" | "put" | "patch" | "delete"

export type WebData<T> = RemoteData<AxiosError, T>
export type AsyncWebData<T> = AsyncRemoteData<AxiosError, T>

export const request = (method: HTTPMethod) => <T, D = undefined>(
  url: string,
  data?: D
): AsyncWebData<T> =>
  axios({
    data,
    method,
    url
  })
    .then((response: AxiosResponse<T>) => Success<AxiosError, T>(response.data))
    .catch((error: AxiosError) => Failure<AxiosError, T>(error))

export const get = request("get")
export const post = request("post")
export const patch = request("patch")
export const put = request("put")
export const del = request("delete")

export const useRemoteData = <T>(
  requestF: () => AsyncWebData<T>
): [WebData<T>, () => void] => {
  const [remoteData, setRemoteData] = useState(NotAsked<AxiosError, T>())

  const fetchRemoteData = () => {
    if (isNotAsked(remoteData)) {
      setRemoteData(Loading())
      requestF().then(setRemoteData)
    }
  }

  return [remoteData, fetchRemoteData]
}