export namespace Utils {
  export const formatDate = (dateStr: string): string => {
    if (dateStr.length === 8 && !dateStr.includes("-")) {
      // YYYYMMDD を想定
      return (
        dateStr.slice(0, 4) +
        "-" +
        dateStr.slice(4, 6) +
        "-" +
        dateStr.slice(6, 8)
      );
    }
    // 想定外のフォーマットの場合はとりあえずそのままにする
    return dateStr;
  };
}
