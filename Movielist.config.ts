const production = false;
const endpoint = production
  ? "https://6biap2l5uh.execute-api.ap-northeast-1.amazonaws.com/Prod/"
  : "http://127.0.0.1:3850";

const config = {
  apiEndPoint: endpoint,
};
export default config;
