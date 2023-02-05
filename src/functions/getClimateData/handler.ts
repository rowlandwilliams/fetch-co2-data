import { middyfy } from "@libs/lambda";
import AWS from "aws-sdk";
import "dotenv/config";
import fetch from "node-fetch";
const regEx = /UTC\((\d+),(\d+),(\d+)\),(\d+\.\d+)/g;
const S3 = new AWS.S3();

const getClimateData = async () => {
  try {
    const response = await fetch(
      "https://www.climatelevels.org/graphs/co2-daily_data.php?callback=1"
    );
    const body: string = await response.text();

    const matches = body
      .match(regEx)
      .map((dateWithValue) =>
        dateWithValue
          .replace("UTC(", "")
          .replace(")", "")
          .split(",")
          .map((splitItem) => Number(splitItem))
      )
      .map((splitDateWithValue) => ({
        year: splitDateWithValue[0],
        date: `${splitDateWithValue[0]}-${splitDateWithValue[1] + 1}-${
          splitDateWithValue[2]
        }`,
        value: splitDateWithValue[3],
      }));

    const allYears = Array.from(new Set(matches.map((match) => match.year)));

    const groupedMatches = allYears.map((year) => ({
      year: year,
      values: matches
        .filter((match) => match.year === year)
        .map(({ date, value }) => ({ date, value })),
    }));

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: "co2-data",
      Body: JSON.stringify(groupedMatches),
      ContentType: "application/json; charset=utf-8",
    };

    await S3.putObject(params).promise();

    return {
      message: "CO2 data succesfully saved to S3.",
    };
  } catch (error) {
    throw new Error(error);
  }
};

if (require.main === module) {
  getClimateData();
}

export const main = middyfy(getClimateData);
