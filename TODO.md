# TODO list for roza

## Smooth player movement
 - [ ] finished

Instead of the current implementation, where you do this currently:
 - INPUT read a keycode
 - DETERMINE if it is 'keyM', 'keyK' or 'keyL',
 - MOVE the player instantly in that direction

You should do this:
 - READ INPUT so that you know which keys are down and which have gone up again. There are two events, 'keydown' and 'keyup'. 
   - Basically, you have a state where 3 keys can be down or up in any moment, and THAT determines the direction. So in your player you need to track what keys are currently pressed.