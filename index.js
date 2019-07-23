const flagRe = /-[A-z0-9]+$/;

function isAllowedTag(version, _tags, _tag) {
  if (! version.match(flagRe)) {
    return true;
  }

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
