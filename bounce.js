/*-----------------------------------------------------------------*\
------------------- #BOUNCE-FUNCTION --------------------
\*------------------------------------------------------------------*/

/* *
 * This is the bouncing function, for providing a "natural" bounce to an html
 * element.  Since cssAnimate does the actual animation, this function's purpose
 * is to manipulate the parameters that are sent to cssAnimate.  By including
 * itself as a callback function to cssAnimate, it sends the parameters for the
 * next bounce.
 *
 * An initializing function should be used to call this function, in order to
 * pass it all of the correct parameters for starting it off.  The initiating
 * function should only provide the initial paramters for the 1st bounce, as
 * well as how many times this function should run (including how much the
 * counterEnd should decrease on each pass, which determines how high successive
 * bounces will be).  After that, this function takes over, manipulates any
 * parameters if needed (it shouldn't be on the first pass), and then passes all
 * of the necessary parameters to the cssAnimate function.  This function will
 * continue until the loopCounter reaches 0.
 *
 * loopCounter dictates how many times this function should be run before
 * exiting.  counterStart tells cssAnimate at what value it's counter should
 * begin with.  counterEnd tells cssAnimate where it's counter should end at,
 * which is how high the bounce will "rise" to (or descend from).
 * counterEndDecrease dictates how much counterEnd should decrease when needed,
 * which will only be used in the callback function in "falling" bounces (since
 * the next "rise" will need to go slightly lower than the previous bounce).
 * counterValue tells cssAnimate how much it's counter should increase for each
 * loop.  counterAdjust is used for "falling" bounces, so that cssAnimate can
 * use the same function for both "rising" and "falling" (this will equal the
 * negative value of counterEnd). intervalValue will tell cssAnimate how fast
 * (or slow) it's loop should run.  targetElement tells cssAnimate which html
 * element to manipulate.  styleProperty tells cssAnimate what style property to
 * manipulate (height, width, top, bottom, etc...).  styleUnit tells cssAnimate
 * which type of unit to use with styleProperty (px, %, etc...).
 *
 * There were several ways to do the callback functionality, but I chose the
 * anonymous method because it seemed the simplest.  The bind method doesn't
 * have older browser support.  The apply method gets a bit convoluted since
 * cssAnimate already has quite a few arguments of it's own.  This method seemed
 * to me to be more elegant, while using roughly the same amount of code or in
 * some cases a lot less code.  Some ES6 features may make for a better way
 * to do this, but seeing as it is still very new I didn't want to go that route
 * just yet.  Given enough time, this should be updated using those methods
 * instead if that proves to be true.
 *
 * I also wrote an alternate bounce (alternate-bounce.js) function that I had
 * used previously, but I prefer this because it lets me take advantage of my
 * cssAnimate function which was made specifically for reusability.  It creates
 * it's own loop (1 loop that does 1 "rise" and 1 "fall"), but this was less
 * code so I made this one my main function for bounce.
 *
 * The initializing function (or the function that calls the initializing
 * function) can be used with a timeout to delay the bounce, or with an interval
 * so that it runs indefinitely.
 */

function bounce (loopCounter, counterStart, counterEnd, counterEndDecrease, counterValue, counterAdjust, intervalSetting, targetElement, styleProperty, styleUnit) {

  'use strict';

  var animateCounterAdjust, callbackCounterEnd;

  // Initialize any variables that will be needed to manipulate paramters for successive animations (or for use in the callback functionality)
  animateCounterAdjust = 0;  // This will be manipulated only for "falling" bounces, since those will need to decrease their style property value.  This does need to be set to 0 on each pass though, so that any "rising" bounces will not have their animation counters adjusted.  This is used for the cssAnimate function, while counterAdjust is used in the callback function that is passed into cssAnimate
  callbackCounterEnd = counterEnd;  // Like animateCounterAdjust above, this will be manipulated only for "falling" bounces, since the callback for those will need have their counterEnd's adjusted so that the next bounce does not go as high.  This needs to be set equal to counterEnd by default, so that on passes where it does not need to be decreased it can still be used (or rather, so that 1 single function can be used regardless of which animation is needed).  counterEnd is used for the cssAnimate function, while this is used in the callback function given that is passed into cssAnimate

  // First, make sure the loopCounter has not reached 0.  If it has, end the function by returning true
  if (loopCounter === 0) {

    return true;

  // The loopCounter has not reached 0, so continue to call cssAnimate with the new parameters while decreasing the loopCounter by 1
} else if (loopCounter > 0) {

    // This will check for an odd number.  An odd number should signify a "falling" bounce, since a full bouncing animation will always need to be looped in pairs (1 "rise" and 1 "fall").  "Falling" bounces will need to manipulate a couple of values, so this check is needed in order to do that
    if (loopCounter % 2 !== 0) {

      animateCounterAdjust = -Math.abs(counterEnd);  // Since "falling" bounces need their style property values decremented, a negative value equivalent of counterEnd will have to be used for the calculation.  This will allow an incrementing counter to to actually decrease the value we need (i.e. -20 + 1 = -19, which is then converted back to a positive integer).  A negative counter could be used instead, but then counterEnd and counterStart will need to be reversed on every pass.  So, while this method requires an extra value and an extra calculation, doing it this way is actually less code and/or less complicated;  This is only used for the cssAnimate function, while counterAdjust is used inside the callback function given to cssAnimate
      callbackCounterEnd = counterEnd - counterEndDecrease;  // On "falling" bounces, the counterEnd will need to be decreased (by the amount specified in the original initializing function) so that the next "rise" will not go quite as high as the previous bounce;  This is only used inside the callback function given to cssAnimate, while counterEnd is used for cssAnimate

    }

    loopCounter -= 1;  // Decrement the loopCounter by 1 so that when it reaches 0, the bounce function can terminate

    // Finally, call cssAnimate using the parameters that were passed into bounce;  Wrap the callback function into an anonymous function so that we can pass all of the correct values;  The passed in variables as seen by the function are as follows: counterStart, counterEnd, counterValue, counterAdjust, intervalSetting, targetElement, styleProperty, styleUnit, callback
    cssAnimate(counterStart, counterEnd, counterValue, animateCounterAdjust, intervalSetting, targetElement, styleProperty, styleUnit, function () { bounce(loopCounter, counterStart, callbackCounterEnd, counterEndDecrease, counterValue, counterAdjust, intervalSetting, targetElement, styleProperty, styleUnit); });

  }

}
