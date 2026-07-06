window.AbundancePortalData={
  results:{
    A:{slug:'scarcity-loop',title:'Scarcity Loop',tag:'You keep preparing for less.',scoreLine:'Your abundance block: Scarcity Loop',diagnosis:'You want more. But part of you still expects pressure, loss, or struggle.',hit:'That old pattern keeps dragging you back to the same level.',reset:'It is safe for me to receive more than I am used to.',cta:'Run The 7-Minute Abundance Reset'},
    B:{slug:'worthiness-ceiling',title:'Worthiness Ceiling',tag:'You shrink before the next level.',scoreLine:'Your abundance block: Worthiness Ceiling',diagnosis:'You have the ability. But your self-image has not caught up yet.',hit:'So you undercharge, delay, explain, or question yourself right before the door opens.',reset:'I am allowed to become the person who receives more.',cta:'Break The Worthiness Ceiling'},
    C:{slug:'control-grip',title:'Control Grip',tag:'You try to force everything.',scoreLine:'Your abundance block: Control Grip',diagnosis:'You want the perfect plan before you move.',hit:'That pressure makes you overthink instead of choosing cleanly and moving.',reset:'I can move with faith without controlling every detail.',cta:'Run The Calm Power Reset'},
    D:{slug:'visibility-block',title:'Visibility Block',tag:'You pull back when it is time to be seen.',scoreLine:'Your abundance block: Visibility Block',diagnosis:'Your next level needs your voice, your offer, your work, or your gift to be seen.',hit:'But old fear makes you hide right when attention could change everything.',reset:'It is safe for me to be seen at my next level.',cta:'Clear The Visibility Block'},
    E:{slug:'old-identity-pull',title:'Old Identity Pull',tag:'The old you keeps taking the wheel.',scoreLine:'Your abundance block: Old Identity Pull',diagnosis:'You are trying to create a new life with an old identity still running underneath.',hit:'That is why the same level keeps repeating.',reset:'The old version of me does not get to lead my future anymore.',cta:'Install The New Identity'},
    R:{slug:'receiving-wall',title:'Receiving Wall',tag:'You want more, but receiving feels unsafe.',scoreLine:'Your abundance block: Receiving Wall',diagnosis:'You can desire more. But when more gets close, your system tightens.',hit:'So money, love, support, success, or attention comes close… then you push it away.',reset:'I allow more good to reach me without pushing it away.',cta:'Open The Receiving Reset'},
    F:{slug:'future-self-disconnect',title:'Future Self Disconnect',tag:'You see the dream, but you do not live from it yet.',scoreLine:'Your abundance block: Future Self Disconnect',diagnosis:'You know there is another version of you. But your daily choices still come from the old level.',hit:'That gap keeps your dreams stuck in your head instead of in your life.',reset:'I choose from the version of me who already lives the next level.',cta:'Build The Future Self Reset'}
  },
  questions:[
    {q:'When you think about your next level, what hits first?',a:[['A','Fear it will disappear.'],['B','Doubt I am ready.'],['C','Pressure to figure it all out.'],['D','Fear of being judged.'],['E','A pull back to the old me.']]},
    {q:'When more starts coming in, what usually happens?',a:[['A','I expect a problem.'],['B','I question if I deserve it.'],['C','I overthink the next move.'],['D','I hide or delay.'],['E','I sabotage it without meaning to.']]},
    {q:'Which thought sounds most like you?',a:[['A','I want more, but I do not want to lose it.'],['B','Maybe other people get that life, not me.'],['C','I need the perfect plan first.'],['D','I do not want people watching me fail.'],['E','Every time I change, the old me pulls me back.']]},
    {q:'What blocks your breakthrough the most?',a:[['A','Fear of instability.'],['B','Not feeling good enough yet.'],['C','Too many thoughts.'],['D','Fear of being seen.'],['E','Repeating the same old pattern.']]},
    {q:'What is hardest to believe?',a:[['A','That the good will last.'],['B','That I deserve it.'],['C','That I will know what to do.'],['D','That people will support it.'],['E','That I can actually become that person.']]},
    {q:'What do you need most right now?',a:[['A','Safety.'],['B','Worthiness.'],['C','Clarity.'],['D','Confidence.'],['E','A new identity.']]},
    {q:'What do you want to stop doing?',a:[['A','Expecting struggle.'],['B','Shrinking my value.'],['C','Forcing every outcome.'],['D','Hiding from attention.'],['E','Letting the old me run my future.']]}
  ],
  getResultKey:function(counts){
    const ordered=Object.entries(counts).sort((x,y)=>y[1]-x[1]);
    const top=ordered[0]||['E',0];
    const second=ordered[1]||['A',0];
    const pair=[top[0],second[0]].sort().join('');
    if(top[1]===second[1]){
      if(pair==='AB')return 'R';
      if(pair==='CE')return 'F';
    }
    return top[0];
  }
};
