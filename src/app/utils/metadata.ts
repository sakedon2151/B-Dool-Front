export const getWorkspaceMetadata = () => {
  try {
    const storageData = sessionStorage.getItem("workspace-storage");
    if (storageData) {
      const parsed = JSON.parse(storageData);
      return {
        title: parsed.state?.currentWorkspace?.name || "B-DOOL Workspace",
        description:
          parsed.state?.currentWorkspace?.description ||
          "가볍게 사용하는 협업 메신저",
      };
    }
  } catch (error) {
    console.error("워크스페이스 메타데이터 가져오기 실패:", error);
  }
  return {
    title: "B-DOOL - Workspace",
    description: "가볍게 사용하는 협업 메신저",
  };
};
