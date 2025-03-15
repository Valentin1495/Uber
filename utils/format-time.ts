export const formatTime = (rawTimestamp: number) => {
  const timestamp = Math.floor(rawTimestamp); // 소수점 이하 버리기 (정수형 밀리초로 변환)

  const date = new Date(timestamp); // 밀리초 단위로 변환

  const formattedDate = date.toLocaleDateString('en-US');

  return formattedDate;
};
