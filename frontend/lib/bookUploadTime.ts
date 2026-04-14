export  const monthDiff = (givenDate: string) => {
    const currentDate = new Date();
    const givenDateConverted=new Date(givenDate)


    const monthDiff =
      (currentDate.getFullYear() - givenDateConverted.getFullYear()) * 12 +
      (currentDate.getMonth() - givenDateConverted.getMonth());

    return monthDiff;
  };