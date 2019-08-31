import svg4everybody from 'svg4everybody';
import { isIE } from './utils/is';

export default function() {
    isIE();
    svg4everybody();
}
