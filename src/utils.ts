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
    } else if (dateStr.length === 6 && !dateStr.includes("-")) {
      // YYYYMM を想定
      return dateStr.slice(0, 4) + "-" + dateStr.slice(4, 6);
    }
    // 想定外のフォーマットの場合はとりあえずそのままにする
    return dateStr;
  };
}
