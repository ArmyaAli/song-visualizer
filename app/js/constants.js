import { drawVerticalBars, drawCircles, drawHorizontalBars, drawPD, drawStars } from './jobs.js'

export const dispatchMap = {
    "Vertical Bars": drawVerticalBars,
    "Horizontal Bars": drawHorizontalBars,
    "Circles": drawCircles,
    "Possion distribution": drawPD,
    "Stars": drawStars
}