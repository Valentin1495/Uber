import axios from "axios";

const URL = "https://airbnb13.p.rapidapi.com/search-location";

export const getRooms = async (
  destination: string,
  checkin: string,
  checkout: string,
  guests: number
) => {
  try {
    const {
      data: { results },
    } = await axios.get(URL, {
      params: {
        location: destination,
        checkin,
        checkout,
        adults: guests,
      },
      headers: {
        "X-RapidAPI-Key": "40a1382aa9msh820b9e04ce5bbeep1d9467jsn666fe9f68405",
        "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
      },
    });
    return results;
  } catch (error) {
    console.log(error);
  }
};
