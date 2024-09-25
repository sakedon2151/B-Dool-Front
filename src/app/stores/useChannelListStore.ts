// import axios from "axios"
// import { error } from "console"
// import { create } from "zustand"

// // store 초기값
// const useChannelListStore = create((set) => ({
//     selectedWorkspaceId: null,
//     channels: [],

//     // selectWorkspaceId 의 파라미터로 넣은 정수는 selectedWorkspaceId 가 가지게 됩니다.
//     selectWorkspaceId: (id: number) => set({
//         selectedWorkspaceId: id
//     }),

//     // axios get 통신 이후 서버로부터 응답받은 리스트는 channels 가 가지게 됩니다. 예외처리: 요청에 실패하면 비어있는 리스트를 가집니다.
//     fetchChannels: async (id: number) => {
//         try {
//             const response = await axios.get(`/api/workspaces/${id}/channels`)
//             set({ channels: response.data })
//         } catch {
//             console.error('채널 리스트 요청 실패: ', error)
//             set({ channels: [] })
//         }
//     }
// }))

// export default useChannelListStore
