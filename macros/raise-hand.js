/**
 * Raise Hand Macro
 * Use this Macro to signal that your player is raising their hand.
 */
(async () => {
  // Issue the chat message command that our core logic listens for
  await ChatMessage.create({
    content: '/raise-hand',
    whisper: [],
    type: CONST.CHAT_MESSAGE_TYPES.OOC
  });
})();