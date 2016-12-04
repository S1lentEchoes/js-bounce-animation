/*-------------------------------------------------------------------*\
---------------- #CSS-ANIMATE-FUNCTION -----------------
\*-------------------------------------------------------------------*/

/* *
 * CSS animating function, can be used to alter an element (targetElement) by
 * adjusting (counterStart + counterValue - plus counterAdjust if a decrement is
 * needed instead) a specific style (styleProperty, i.e. height, width, etc...)
 * in a specific way (styleUnit, i.e. %, vw, vh, etc..), with an optional
 * callback function when things like opacity/fade, display: block, etc... are
 * needed afterwards by the calling function.
 *
 * The duration can be adjusted by both intervalSetting and counterValue,
 * although counterValue generally gives a finer/better grain of control.
 *
 * For some animations, a negative value is passed to be added to the
 * counterStart which is then converted back to a positive value.  That allows
 * this function to do both opening and closing animations and without much
 * extra code (requiring 1 extra variable - counterAdjust and 1 extra operation
 * - adjustedValue).  For example, if the targetElement is at 20 and you need to
 * go down to 19, then providing a counterAdjust of -20 and adding +1, you will
 * get -19.  This is then converted back to a positive integer for the correct
 * value.  A negative counterValue could also be used, but then you have to redo
 * counterEnd and counterStart.  So, while this method adds an extra variable
 * and an extra operation it is actually simpler and less code since changing
 * counterValue means doing different checks for counterEnd and counterStart as
 * well as switching the values for every closing animation.
 *
 * I tried just about every way to do this and this seemed like the most
 * efficient way, but I could be wrong.  I'd love to know other ways to do this,
 * especially better/more efficient ones
 */

function cssAnimate(counterStart, counterEnd, counterValue, counterAdjust, intervalSetting, targetElement, styleProperty, styleUnit, callback) {

  'use strict';

  var adjustedValue, interval;

  // Start the interval for the animation process;  This will be looped over until counterStart equals counterEnd, at which point the interval will be cleared and a callback function intiated (if provided)
  interval = setInterval(function () {

    // counterStart has equalled or exceeded counterEnd, so clear the interval and initiate the callback function if it has been set by the calling function
    if (counterStart >= counterEnd) {

      // Callback function initiated here.  If parameters are needed for the callback function, then wrap the needed function in an anonymous function and have the anonymous function called instead (this is how bounce as done, so refer to that for an example)
      if (callback) {
        callback();
      }

      clearInterval(interval);  // Finally, clear the interval setting after all settings have been set

    // As long as counterStart is less than counterEnd, this will be looped over
  } else if (counterStart < counterEnd) {

      counterStart += counterValue;  // Increase the counterStart variable by the counterValue amount (both values were passed in by the calling function);  Increase or decrease counterValue to control the speed of the animation (intervalSetting as well, but this generally gives better control)

      adjustedValue = Math.abs(counterAdjust + counterStart);  // counterAdjust is determined by the calling function;  For adding (opening or starting the animation, generally) this usually means adding 0 to the counterStart (since those usually start at 0 and keep adding until the required height/width/etc... is reached);  But for closing or ending the animation this means adding the counterStart to the negative value of counterEnd, which is then converted back to a positive number in order to arrive at the correct value for targetElement's height/width/etc... (since closing animations generally need to start from a high value, say 500 and decrease until 0;  The only way to do this without writing another entire function (or adding exccessive conditionals) is to pass a negative value equal to the targetElements height/width/etc... and add the counterStart ((thereby subtracting the counterStart value from counterEnd, i.e. -500 + 10 = -490, which is then changed back to positive to arrive at the correct value which is 490)))

      targetElement.style[styleProperty] = adjustedValue + styleUnit;  // Apply the new value to the targetElement

    }

  }, intervalSetting);  // intervalSetting was passed in from the initializing function;  Adjusting this value will make the animation run faster or slower (although the counterValue may also be used to control the speed, and in some cases better at it)

}
