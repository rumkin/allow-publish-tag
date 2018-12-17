function isAllowedTag(_tags, _tag) {
  const tag = _tag.toLowerCase();
  const tags = _tags.map(function(allowed) {
    return allowed.toLowerCase();
  });

  for (let i = 0; i < tags.length; i++) {
    if (tags[i] === tag) {
      return true;
    }
  }

  return false;
}

module.exports = isAllowedTag;
