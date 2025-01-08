export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const getDate = (newdate) => {
  const { date } = convertUTCtoIST(newdate);
  return date;
};

export function convertUTCtoIST(utcDateStr) {
  const utcDate = new Date(utcDateStr);
  const istDate = new Date(utcDate.getTime()); // IST offset from UTC is +5.5 hours

  const formattedDate = istDate
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const formattedTime = istDate.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date: formattedDate, time: formattedTime };
}

export function formatTimeDifference(targetDate) {
  const currentDate = new Date();
  const targetDateTime = new Date(targetDate);

  const timeDifferenceInMilliseconds = targetDateTime - currentDate;
  const timeDifferenceInSeconds = Math.abs(timeDifferenceInMilliseconds) / 1000;

  if (timeDifferenceInSeconds < 60) {
    return `${Math.floor(timeDifferenceInSeconds)} sec`;
  } else if (timeDifferenceInSeconds < 3600) {
    return `${Math.floor(timeDifferenceInSeconds / 60)} min`;
  } else if (timeDifferenceInSeconds < 86400) {
    return `${Math.floor(timeDifferenceInSeconds / 3600)} hr`;
  } else if (timeDifferenceInSeconds < 604800) {
    return `${Math.floor(timeDifferenceInSeconds / 86400)} days`;
  } else if (timeDifferenceInSeconds < 2419200) {
    return `${Math.floor(timeDifferenceInSeconds / 604800)} weeks`;
  } else if (timeDifferenceInSeconds < 29030400) {
    return `${Math.floor(timeDifferenceInSeconds / 2419200)} months`;
  } else {
    return `${Math.floor(timeDifferenceInSeconds / 29030400)} years`;
  }
}

export function getTimeOfPosted(utcTime) {
  const inputTime = new Date(utcTime);
  const currentTime = new Date();
  const timeDifferenceInSeconds = (currentTime - inputTime) / 1000;
  if (timeDifferenceInSeconds < 60) {
    return "Just now";
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes}m`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours}h`;
  } else if (timeDifferenceInSeconds < 2592000) {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days}d`;
  } else if (timeDifferenceInSeconds < 77760000) {
    // Approximately 3 months
    const months = Math.floor(timeDifferenceInSeconds / 2592000);
    return `${months}mo`;
  } else if (timeDifferenceInSeconds < 31536000) {
    const months = Math.floor(timeDifferenceInSeconds / 2592000);
    const remainingDays = Math.floor(
      (timeDifferenceInSeconds % 2592000) / 86400
    );
    return `${months}mo ${remainingDays}d`;
  } else {
    const years = Math.floor(timeDifferenceInSeconds / 31536000);
    return `${years}y`;
  }
}
export const getTime = (newtime) => {
  const { time } = convertUTCtoIST(newtime);
  return time;
};
