import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function Test () {
  const percentage = 75;
  return <CircularProgressbar value={percentage} text={`${percentage}%`} />;
}

export default Test;