/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 126:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ./node_modules/regenerator-runtime/runtime.js
var runtime = __webpack_require__(538);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(745);
// EXTERNAL MODULE: ./node_modules/react-dom/client.js
var client = __webpack_require__(769);
// EXTERNAL MODULE: ./node_modules/lodash.get/index.js
var lodash_get = __webpack_require__(636);
var lodash_get_default = /*#__PURE__*/__webpack_require__.n(lodash_get);
// EXTERNAL MODULE: ./node_modules/d3-hierarchy/src/hierarchy/index.js + 13 modules
var hierarchy = __webpack_require__(620);
// EXTERNAL MODULE: ./node_modules/d3-hierarchy/src/tree.js
var src_tree = __webpack_require__(873);
// EXTERNAL MODULE: ./node_modules/d3-zoom/src/index.js + 54 modules
var src = __webpack_require__(210);
// EXTERNAL MODULE: ./node_modules/d3-selection/src/select.js
var src_select = __webpack_require__(191);
;// CONCATENATED MODULE: ./src/components/trees/Tree/constants.js


/*
    Constants used for rendering a plum tree. Mostly size values used throughout
    the tree.
 */
var TREE_DEPTH = 170;
var NODE_HEIGHT = 80;
var NODE_WIDTH = 160;
var NODE_BUTTON_RADIUS = 14;
var NODE_AVATAR_RADIUS = 30;
var NODE_SMALL_AVATAR_RADIUS = 20;
var NODE_PARTNER_PARTNER_CX = 150;
var NODE_PLUS_WIDTH = 10;
var NODE_PLUS_HEIGHT = NODE_PLUS_WIDTH;
var TREE_TOP_PADDING = 120;
var PARTNER_PADDING = 10;
var PARTNER_ABDUCTION_BASE_Y = 5;
var PARTNER_ABDUCTION_BASE_HEIGHT = 4;
var PARTNER_ABDUCTION_BASE_WIDTH = 12;
var PARTNER_ABDUCTION_TOP_Y = 5;
var PARTNER_ABDUCTION_TOP_RADIUS = 3;
var LINK_LIST_WIDTH = 198;
var LINK_LIST_FONT_SIZE = 14;
var LINK_LIST_LINE_HEIGHT = 20;
var LINK_LIST_PADDING_TOP = 14;
var LINK_LIST_PADDING_LEFT = 16;
var LINK_BUTTON_PATTERN = 'link-icon';
var PLUS_BUTTON_PATTERN = 'plus-icon';
var EDIT_BUTTON_PATTERN = 'edit-icon';
var DEFAULT_AVATAR_PATTERN = 'default-avatar';
var DEFAULT_SMALL_AVATAR_PATTERN = 'default-small-avatar';
// EXTERNAL MODULE: ./node_modules/uuid/dist/esm-browser/v4.js + 3 modules
var v4 = __webpack_require__(455);
;// CONCATENATED MODULE: ./src/components/trees/Tree/styles.scss
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles = ({"root":"dee461a6","link":"a4ab847d","person":"c09c7714","background":"f238e69d","avatar":"eed76e7e","plus":"caaee8f8","abduction":"ec17b431","marriage":"c189b6ae","personDetails":"b643d5ec","showTreeDetails":"c03e28fb","treeDetails":"ef667a62","treeImage":"e4537bce","treeDetailsContent":"c3397b9e","personDetailsTop":"e5a43ddc","personDetailsAvatar":"d3591240","parentRow":"b04289c2","parentAvatar":"e3085c10","editButton":"e321c1e4","closeButton":"d0783d74","close":"c7991ffb","tag":"c7316501","linksIcon":"cb8948ad","addChildIcon":"a7c72566","editNodeIcon":"cadb010e","linkList":"a6eac7ae","linkListItem":"df58b04d","linkListText":"d2475797","linkDetailsToggle":"afa79212","linkDetails":"d60bfa01"});
;// CONCATENATED MODULE: ./src/components/trees/TreeDownload/Person.jsx





var Person = function Person(props) {
  var small = props.small,
    personData = props.personData,
    nodeData = props.nodeData,
    transform = props.transform,
    mute = props.mute,
    highlightParents = props.highlightParents,
    unhighlightParents = props.unhighlightParents;
  function handleMouseOver() {
    highlightParents && highlightParents();
  }
  function handleMouseOut() {
    unhighlightParents && unhighlightParents();
  }
  var avatarRadius = small ? NODE_SMALL_AVATAR_RADIUS : NODE_AVATAR_RADIUS;
  var fillId = small ? DEFAULT_SMALL_AVATAR_PATTERN : DEFAULT_AVATAR_PATTERN;
  var personAvatar = lodash_get_default()(personData, 'avatar', false);
  var image;
  if (!lodash_get_default()(personData, '_id', false)) {
    return null; // no person set
  }

  if (personAvatar) {
    fillId = (0,v4/* default */.Z)();
    image = /*#__PURE__*/react.createElement("image", {
      className: "avatar-image",
      "aria-hidden": "true",
      xmlnsXlink: "http://www.w3.org/1999/xlink",
      xlinkHref: "./images/".concat(personData.avatar),
      x: "0",
      y: "0",
      width: avatarRadius * 2,
      height: avatarRadius * 2,
      preserveAspectRatio: "xMidYMid slice"
    });
  }

  // extra node data for person details pane (main node person only)
  var parentType = lodash_get_default()(nodeData, 'data.parentType', 'NONE');
  var parents = lodash_get_default()(nodeData, 'data.parents', []).map(function (parent) {
    return lodash_get_default()(parent, '_id');
  });
  var adoptiveParents = lodash_get_default()(nodeData, 'data.adoptiveParents', []).map(function (parent) {
    return lodash_get_default()(parent, '_id');
  });
  return /*#__PURE__*/react.createElement("g", {
    className: "person",
    transform: transform
  }, personAvatar && /*#__PURE__*/react.createElement("defs", null, /*#__PURE__*/react.createElement("pattern", {
    className: "avatar-pattern",
    id: fillId,
    width: "1",
    height: "1",
    x: "10",
    y: "10"
  }, image)), /*#__PURE__*/react.createElement("circle", {
    className: styles.avatar,
    opacity: mute ? '0.5' : '1',
    r: avatarRadius,
    cx: avatarRadius + (NODE_HEIGHT - avatarRadius * 2) / 2,
    cy: avatarRadius + (NODE_HEIGHT - avatarRadius * 2) / 2,
    fill: "url(#".concat(fillId, ")"),
    onClick: function onClick() {
      return props.showPersonDetails(personData._id, parentType, parents, adoptiveParents);
    },
    onMouseOver: handleMouseOver,
    onMouseOut: handleMouseOut
  }));
};
/* harmony default export */ const TreeDownload_Person = (Person);
;// CONCATENATED MODULE: ./src/components/trees/Tree/PartnerType.jsx



/* harmony default export */ const PartnerType = (function (_ref) {
  var type = _ref.type;
  if (type === 'PARTNER' || type === 'EX_PARTNER') {
    var transform = 'translate(-5,35)';
    if (type === 'EX_PARTNER') {
      transform += ' rotate(45,5,5)';
    }
    return /*#__PURE__*/react.createElement("g", {
      className: type === 'EX_PARTNER' ? "".concat(styles.plus, " ex-partner-symbol") : "".concat(styles.plus, " partner-symbol"),
      transform: transform
    }, /*#__PURE__*/react.createElement("line", {
      x1: NODE_PLUS_WIDTH / 2,
      y1: "0",
      x2: NODE_PLUS_WIDTH / 2,
      y2: NODE_PLUS_HEIGHT
    }), /*#__PURE__*/react.createElement("line", {
      x1: "0",
      y1: NODE_PLUS_HEIGHT / 2,
      x2: NODE_PLUS_WIDTH,
      y2: NODE_PLUS_HEIGHT / 2
    }));
  }
  if (type === 'ABDUCTION') {
    return /*#__PURE__*/react.createElement("g", {
      className: "".concat(styles.abduction, " abduction-symbol"),
      transform: "translate(-5,35)"
    }, /*#__PURE__*/react.createElement("circle", {
      cx: PARTNER_ABDUCTION_BASE_WIDTH / 2,
      cy: PARTNER_ABDUCTION_TOP_Y,
      r: PARTNER_ABDUCTION_TOP_RADIUS
    }), /*#__PURE__*/react.createElement("rect", {
      x: "0",
      y: PARTNER_ABDUCTION_BASE_Y,
      ry: PARTNER_ABDUCTION_BASE_HEIGHT / 2,
      width: PARTNER_ABDUCTION_BASE_WIDTH,
      height: PARTNER_ABDUCTION_BASE_HEIGHT
    }));
  }
  if (type === 'MARRIED') {
    return /*#__PURE__*/react.createElement("polyline", {
      transform: "translate(-2,35)",
      className: "".concat(styles.marriage, " marriage-symbol"),
      points: "0,10 0,3 3,6 6,3 6,10"
    });
  }
  return null;
});
;// CONCATENATED MODULE: ./src/components/trees/TreeDownload/Partner.jsx




/* harmony default export */ const Partner = (function (_ref) {
  var partners = _ref.partners,
    partnerData = _ref.partnerData,
    people = _ref.people,
    transform = _ref.transform,
    highlightPeople = _ref.highlightPeople,
    showPersonDetails = _ref.showPersonDetails;
  var nodePartners = partners;
  var partnerPeople = partnerData.people;
  var partnerType = partnerData.type;
  return /*#__PURE__*/react.createElement("g", {
    className: "partner",
    transform: transform
  }, /*#__PURE__*/react.createElement(PartnerType, {
    type: partnerType
  }), partnerPeople.map(function (person, index) {
    var small = nodePartners.length > 1 || index > 0;
    var personData = people.find(function (p) {
      return p._id === lodash_get_default()(person, '_id');
    });

    // check if we need to mute/darken the node person.
    var personId = lodash_get_default()(personData, '_id');
    var mute = personId && highlightPeople && highlightPeople.length && !highlightPeople.includes(personId);
    return /*#__PURE__*/react.createElement(TreeDownload_Person, {
      key: index,
      personData: personData,
      small: small,
      transform: "translate(".concat(index * 35, ",0)"),
      showPersonDetails: showPersonDetails,
      mute: mute
    });
  }));
});
;// CONCATENATED MODULE: ./src/components/trees/TreeDownload/Node.jsx





/* harmony default export */ const Node = (function (_ref) {
  var nodeData = _ref.nodeData,
    highlightPeople = _ref.highlightPeople,
    highlightParents = _ref.highlightParents,
    showPersonDetails = _ref.showPersonDetails,
    people = _ref.people;
  function doHighlightParents() {
    var nodeParentIds = lodash_get_default()(nodeData, 'data.parents', []).map(function (parent) {
      return parent._id;
    });
    if (lodash_get_default()(nodeData, 'parent') && highlightParents) {
      highlightParents(nodeData.parent, nodeParentIds);
    }
  }
  function doUnhighlightParents() {
    if (lodash_get_default()(nodeData, 'parent') && highlightParents) {
      highlightParents(nodeData.parent, []);
    }
  }
  function nodePosition(node) {
    var left = NODE_HEIGHT / 2;
    if (node.data.partners.length > 0) {
      left = NODE_HEIGHT;
    }
    return [node.x - left, node.y];
  }
  function getPartnerPosition(index, partnerCount) {
    var partnerSize = NODE_SMALL_AVATAR_RADIUS * 2 + PARTNER_PADDING;
    var totalHeight = partnerCount * partnerSize;
    var heightDiff = (NODE_HEIGHT - totalHeight) / 2;
    var offset = partnerSize / 2 + heightDiff;
    var y = index * partnerSize + offset - 40;
    return [80, y];
  }
  function getNodeWidth(node) {
    if (node.data.partners.length > 0) {
      return NODE_HEIGHT * 2;
    }
    return NODE_HEIGHT;
  }
  var nodeX = nodePosition(nodeData)[0];
  var nodeY = nodePosition(nodeData)[1];
  var personData = people.find(function (p) {
    return p._id === lodash_get_default()(nodeData, 'data.person._id');
  });
  var partners = nodeData.data.partners;

  // check if we need to mute/darken the node person.
  var personId = lodash_get_default()(personData, '_id');
  var mute = personId && highlightPeople && highlightPeople.length && !highlightPeople.includes(personId);
  return /*#__PURE__*/react.createElement("g", {
    className: "node",
    transform: "translate(".concat(nodeX, ",").concat(nodeY, ")")
  }, /*#__PURE__*/react.createElement(TreeDownload_Person, {
    personData: personData,
    nodeData: nodeData,
    showPersonDetails: showPersonDetails,
    mute: mute,
    highlightParents: doHighlightParents,
    unhighlightParents: doUnhighlightParents
  }), partners.map(function (partnerData, index, partners) {
    var partnerPosition = getPartnerPosition(index, partners.length);
    return /*#__PURE__*/react.createElement(Partner, {
      key: index,
      partnerData: partnerData,
      partners: partners,
      people: people,
      transform: "translate(".concat(partnerPosition[0], ",").concat(partnerPosition[1], ")"),
      showPersonDetails: showPersonDetails,
      highlightPeople: highlightPeople
    });
  }));
});
;// CONCATENATED MODULE: ./src/components/trees/Tree/Link.jsx



/* harmony default export */ const Link = (function (_ref) {
  var linkData = _ref.linkData;
  function drawPath() {
    var path = 'M ';
    var startX = linkData.parent.x;

    // start Y is determined by the number of partners
    var sourcePartnersCount = linkData.parent.data.partners.length;
    var partnerSize = NODE_SMALL_AVATAR_RADIUS * 2 + PARTNER_PADDING;
    var totalHeight = sourcePartnersCount * partnerSize;
    var heightDiff = (NODE_HEIGHT - totalHeight) / 2;
    var offset = partnerSize / 2 + heightDiff;
    var startY = sourcePartnersCount * partnerSize + offset + linkData.parent.y;
    var sourceHidden = linkData.parent.data.hidden;
    if (sourceHidden) {
      // start half way down the depth
      path += startX + ' ' + (linkData.parent.y + (TREE_DEPTH - 25));
    } else {
      // start centered to start node just below the + sign
      path += startX + ' ' + (startY - 30);
    }

    // move down half the depth
    path += ' V ' + (linkData.parent.y + (TREE_DEPTH - 30));

    // move to the target x position
    if (linkData.data.partners.length === 0) {
      // if the target has no partners center to the node
      path += ' H ' + linkData.x;
    } else {
      // if the target has partners slightly to the left of the node to
      // get to the node avatar
      path += ' H ' + (linkData.x - 40);
    }

    // // move down to final depth
    path += ' V ' + (TREE_DEPTH * linkData.depth + 10);
    return path;
  }
  return /*#__PURE__*/react.createElement("path", {
    className: styles.link,
    d: drawPath()
  });
});
;// CONCATENATED MODULE: ./src/common/images/default-avatar.png
const default_avatar_namespaceObject = "data:image/png;base64,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";
;// CONCATENATED MODULE: ./src/components/RawHTML/index.jsx

/* harmony default export */ const RawHTML = (function (_ref) {
  var html = _ref.html;
  return /*#__PURE__*/react.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
});
;// CONCATENATED MODULE: ./src/components/trees/TreeDownload/PersonDetails.jsx




/* harmony default export */ const PersonDetails = (function (_ref) {
  var _ref$traits = _ref.traits,
    traits = _ref$traits === void 0 ? [] : _ref$traits,
    _ref$aspirations = _ref.aspirations,
    aspirations = _ref$aspirations === void 0 ? [] : _ref$aspirations,
    _ref$lifeStates = _ref.lifeStates,
    lifeStates = _ref$lifeStates === void 0 ? [] : _ref$lifeStates,
    _ref$parentType = _ref.parentType,
    parentType = _ref$parentType === void 0 ? 'NONE' : _ref$parentType,
    _ref$parents = _ref.parents,
    parents = _ref$parents === void 0 ? [] : _ref$parents,
    _ref$adoptiveParents = _ref.adoptiveParents,
    adoptiveParents = _ref$adoptiveParents === void 0 ? [] : _ref$adoptiveParents,
    _ref$custom = _ref.custom,
    custom = _ref$custom === void 0 ? [] : _ref$custom,
    avatar = _ref.avatar,
    style = _ref.style,
    closeDetails = _ref.closeDetails,
    firstName = _ref.firstName,
    lastName = _ref.lastName,
    bio = _ref.bio;
  var inlineAvatarStyle = {};
  if (avatar) {
    inlineAvatarStyle.backgroundImage = "url(./images/".concat(avatar, ")");
  } else {
    inlineAvatarStyle.backgroundImage = "url(".concat(default_avatar_namespaceObject, ")");
  }
  return /*#__PURE__*/react.createElement("div", {
    className: styles.personDetails,
    style: style
  }, /*#__PURE__*/react.createElement("div", {
    id: "close-person-details",
    className: styles.closeButton,
    onClick: function onClick() {
      return closeDetails();
    }
  }, /*#__PURE__*/react.createElement("span", null, "Close")), /*#__PURE__*/react.createElement("div", {
    className: styles.personDetailsTop
  }, /*#__PURE__*/react.createElement("div", {
    className: styles.personDetailsAvatar,
    style: inlineAvatarStyle
  }), /*#__PURE__*/react.createElement("h2", {
    id: "person-details-name"
  }, firstName, " ", lastName)), /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(RawHTML, {
    html: bio
  })), parents.length > 0 && /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("h3", {
    id: "person-details-biological-parents-title"
  }, "Biological Parents ", /*#__PURE__*/react.createElement(ParentType, {
    type: parentType
  })), /*#__PURE__*/react.createElement("div", null, parents.map(function (parent, index) {
    var backgroundImage = parent.avatar ? "url(./images/".concat(parent.avatar, ")") : "url(".concat(default_avatar_namespaceObject, ")");
    return /*#__PURE__*/react.createElement("div", {
      className: styles.parentRow,
      key: index
    }, /*#__PURE__*/react.createElement("div", {
      className: styles.parentAvatar,
      style: {
        backgroundImage: backgroundImage
      }
    }), /*#__PURE__*/react.createElement("span", {
      className: "person-details-biological-parent-name"
    }, parent.firstName, " ", parent.lastName));
  }))), adoptiveParents.length > 0 && /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("h3", null, "Adoptive Parents"), /*#__PURE__*/react.createElement("div", null, adoptiveParents.map(function (parent, index) {
    var backgroundImage = parent.avatar ? "url(./images/".concat(parent.avatar, ")") : "url(".concat(default_avatar_namespaceObject, ")");
    return /*#__PURE__*/react.createElement("div", {
      className: styles.parentRow,
      key: index
    }, /*#__PURE__*/react.createElement("div", {
      className: styles.parentAvatar,
      style: {
        backgroundImage: backgroundImage
      }
    }), /*#__PURE__*/react.createElement("span", null, parent.firstName, " ", parent.lastName));
  }))), traits.length > 0 && /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("h3", null, "Traits"), /*#__PURE__*/react.createElement("div", null, traits.map(function (trait, index) {
    return /*#__PURE__*/react.createElement("span", {
      className: styles.tag,
      key: index
    }, trait);
  }))), aspirations.length > 0 && /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("h3", null, "Aspirations"), /*#__PURE__*/react.createElement("div", null, aspirations.map(function (aspiration, index) {
    return /*#__PURE__*/react.createElement("span", {
      className: styles.tag,
      key: index
    }, aspiration);
  }))), lifeStates.length > 0 && /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("h3", null, "Life States"), lifeStates.map(function (lifeState, index) {
    return /*#__PURE__*/react.createElement("span", {
      className: styles.tag,
      key: index
    }, lifeState);
  })), custom.length > 0 && /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("h3", null, "More"), /*#__PURE__*/react.createElement("table", {
    className: "table"
  }, /*#__PURE__*/react.createElement("tbody", null, custom.map(function (item, index) {
    return /*#__PURE__*/react.createElement("tr", {
      key: index
    }, /*#__PURE__*/react.createElement("th", {
      scope: "row"
    }, item.title), /*#__PURE__*/react.createElement("td", null, item.value));
  })))));
});
var ParentType = function ParentType(_ref2) {
  var type = _ref2.type;
  if (type === 'CLONE') {
    return /*#__PURE__*/react.createElement("span", {
      className: "label label-blue"
    }, "Clone");
  } else if (type === 'ABDUCTION') {
    return /*#__PURE__*/react.createElement("span", {
      className: "label label-green"
    }, "Alien Abduction");
  } else {
    return null;
  }
};
;// CONCATENATED MODULE: ./src/components/trees/TreeDownload/TreeDetails.jsx



/* harmony default export */ const TreeDetails = (function (_ref) {
  var title = _ref.title,
    description = _ref.description,
    image = _ref.image,
    style = _ref.style,
    closeDetails = _ref.closeDetails;
  var inlineAvatarStyle = {};
  if (image) {
    inlineAvatarStyle.backgroundImage = "url(./images/".concat(image, ")");
  }
  return /*#__PURE__*/react.createElement("div", {
    className: styles.treeDetails,
    style: style
  }, image && /*#__PURE__*/react.createElement("div", {
    className: styles.treeImage,
    style: inlineAvatarStyle
  }), /*#__PURE__*/react.createElement("div", {
    className: styles.closeButton,
    onClick: function onClick() {
      return closeDetails();
    }
  }, /*#__PURE__*/react.createElement("span", null, "Close"), /*#__PURE__*/react.createElement("i", {
    className: styles.close
  })), /*#__PURE__*/react.createElement("div", {
    className: styles.treeDetailsContent
  }, /*#__PURE__*/react.createElement("h1", null, title), /*#__PURE__*/react.createElement(RawHTML, {
    html: description
  })));
});
;// CONCATENATED MODULE: ./src/common/images/link.png
const link_namespaceObject = "data:image/png;base64,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";
;// CONCATENATED MODULE: ./src/common/images/plus.png
const plus_namespaceObject = "data:image/png;base64,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";
;// CONCATENATED MODULE: ./src/common/images/edit.png
const edit_namespaceObject = "data:image/png;base64,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";
;// CONCATENATED MODULE: ./src/components/trees/Tree/CommonPatterns.jsx






/* harmony default export */ const CommonPatterns = (function () {
  return /*#__PURE__*/react.createElement("defs", null, /*#__PURE__*/react.createElement("pattern", {
    id: LINK_BUTTON_PATTERN,
    width: "1",
    height: "1",
    x: "10",
    y: "10"
  }, /*#__PURE__*/react.createElement("image", {
    "aria-hidden": "true",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    xlinkHref: link_namespaceObject,
    x: "0",
    y: "0",
    width: NODE_BUTTON_RADIUS * 2,
    height: NODE_BUTTON_RADIUS * 2,
    preserveAspectRatio: "xMidYMid slice"
  })), /*#__PURE__*/react.createElement("pattern", {
    id: PLUS_BUTTON_PATTERN,
    width: "1",
    height: "1",
    x: "10",
    y: "10"
  }, /*#__PURE__*/react.createElement("image", {
    "aria-hidden": "true",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    xlinkHref: plus_namespaceObject,
    x: "0",
    y: "0",
    width: NODE_BUTTON_RADIUS * 2,
    height: NODE_BUTTON_RADIUS * 2,
    preserveAspectRatio: "xMidYMid slice"
  })), /*#__PURE__*/react.createElement("pattern", {
    id: EDIT_BUTTON_PATTERN,
    width: "1",
    height: "1",
    x: "10",
    y: "10"
  }, /*#__PURE__*/react.createElement("image", {
    "aria-hidden": "true",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    xlinkHref: edit_namespaceObject,
    x: "0",
    y: "0",
    width: NODE_BUTTON_RADIUS * 2,
    height: NODE_BUTTON_RADIUS * 2,
    preserveAspectRatio: "xMidYMid slice"
  })), /*#__PURE__*/react.createElement("pattern", {
    id: DEFAULT_AVATAR_PATTERN,
    width: "1",
    height: "1",
    x: "10",
    y: "10"
  }, /*#__PURE__*/react.createElement("image", {
    "aria-hidden": "true",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    xlinkHref: default_avatar_namespaceObject,
    x: "0",
    y: "0",
    width: NODE_AVATAR_RADIUS * 2,
    height: NODE_AVATAR_RADIUS * 2,
    preserveAspectRatio: "xMidYMid slice"
  })), /*#__PURE__*/react.createElement("pattern", {
    id: DEFAULT_SMALL_AVATAR_PATTERN,
    width: "1",
    height: "1",
    x: "10",
    y: "10"
  }, /*#__PURE__*/react.createElement("image", {
    "aria-hidden": "true",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    xlinkHref: default_avatar_namespaceObject,
    x: "0",
    y: "0",
    width: NODE_SMALL_AVATAR_RADIUS * 2,
    height: NODE_SMALL_AVATAR_RADIUS * 2,
    preserveAspectRatio: "xMidYMid slice"
  })));
});
;// CONCATENATED MODULE: ./src/components/trees/TreeDownload/index.jsx
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }












/* harmony default export */ const TreeDownload = (function (_ref) {
  var tree = _ref.tree,
    _ref$people = _ref.people,
    people = _ref$people === void 0 ? [] : _ref$people,
    readonly = _ref.readonly,
    onChange = _ref.onChange,
    onEditNode = _ref.onEditNode;
  var _useState = (0,react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    zoomInitialized = _useState2[0],
    setZoomInitialized = _useState2[1];
  var _useState3 = (0,react.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    links = _useState4[0],
    setLinks = _useState4[1];
  var _useState5 = (0,react.useState)([]),
    _useState6 = _slicedToArray(_useState5, 2),
    nodes = _useState6[0],
    setNodes = _useState6[1];
  var _useState7 = (0,react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    nodeToHighlight = _useState8[0],
    setNodeToHighlight = _useState8[1];
  var _useState9 = (0,react.useState)([]),
    _useState10 = _slicedToArray(_useState9, 2),
    nodePeopleToHighlight = _useState10[0],
    setNodePeopleToHighlight = _useState10[1];
  var _useState11 = (0,react.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    personDetails = _useState12[0],
    setPersonDetails = _useState12[1];
  var _useState13 = (0,react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    treeDetails = _useState14[0],
    setTreeDetails = _useState14[1];
  var _useState15 = (0,react.useState)('NONE'),
    _useState16 = _slicedToArray(_useState15, 2),
    parentType = _useState16[0],
    setParentType = _useState16[1];
  var _useState17 = (0,react.useState)([]),
    _useState18 = _slicedToArray(_useState17, 2),
    parents = _useState18[0],
    setParents = _useState18[1];
  var _useState19 = (0,react.useState)([]),
    _useState20 = _slicedToArray(_useState19, 2),
    adoptiveParents = _useState20[0],
    setAdoptiveParents = _useState20[1];
  var svg = (0,react.useRef)(null);
  var zoom = (0,react.useRef)(null);
  (0,react.useEffect)(function () {
    setZoomInitialized(false);
  }, []);
  (0,react.useEffect)(function () {
    if (tree && tree.data) {
      updateTreeState(tree.data);
    }
  }, [tree]);
  (0,react.useEffect)(function () {
    if (svg.current && !zoomInitialized) {
      initSVGZoom(svg.current);
    }
  }, [zoomInitialized, svg.current]);

  /**
   * Takes the tree data and generates the links and nodes data followed by
   * setting those in the component state. Called when new props for tree data
   * are received.
   * @param  {Object} tree The tree data
   * @return {void}
   */
  function updateTreeState(tree) {
    // setup tree data
    var root = (0,hierarchy/* default */.ZP)(tree);

    // declares a tree layout
    var treeMap = (0,src_tree/* default */.Z)().nodeSize([200, 80]).separation(function (a, b) {
      return a.parent === b.parent ? 1 : 1.2;
    });
    var treeData = treeMap(root);

    // compute the tree layout nodes and links
    var nodes = treeData.descendants();

    // overwrite the height increase for each node depth/generation
    nodes.forEach(function (d) {
      d.y = d.depth * TREE_DEPTH;
    });

    // get link data (from nodes minus the root node)
    var links = nodes.slice(1);

    // set state data for our tree to render
    setNodes(nodes);
    setLinks(links);
  }
  function initSVGZoom(svg) {
    // have to check both clientWidth and parentNode.clientWidth to fix FireFox
    // issue where clientWidth is 0
    var width = svg.clientWidth || svg.parentNode.clientWidth;
    var zoomInstance = (0,src/* zoom */.sP)().scaleExtent([0.1, 3]).on('zoom', zoomed);
    var selectionSvg = (0,src_select/* default */.Z)('svg').call(zoomInstance);

    // move to initial position
    zoomInstance.translateBy(selectionSvg, width / 2, TREE_TOP_PADDING);
    setZoomInitialized(true);
  }
  function zoomed(event) {
    var zoomTransform = event.transform;
    zoom.current.setAttribute('transform', "translate(".concat(zoomTransform.x, ",").concat(zoomTransform.y, ")scale(").concat(zoomTransform.k, ")"));
  }
  function showPersonDetails(personId) {
    var parentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'NONE';
    var parentIds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var adoptiveParentIds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var personDetails = people.find(function (p) {
      return p._id === personId;
    });
    var parents = parentIds.map(function (parentId) {
      return people.find(function (person) {
        return person._id === parentId;
      });
    });
    var adoptiveParents = adoptiveParentIds.map(function (parentId) {
      return people.find(function (person) {
        return person._id === parentId;
      });
    });
    setPersonDetails(personDetails);
    setParentType(parentType);
    setParents(parents);
    setAdoptiveParents(adoptiveParents);
  }
  function handleShowTreeDetails() {
    setTreeDetails(true);
  }
  function closePersonDetails() {
    setPersonDetails(null);
  }
  function closeTreeDetails() {
    setTreeDetails(false);
  }
  function addNode(node) {
    var newNode = {
      partners: []
    };

    // create a record of the child indexes in the tree to get to the node we
    // want to add a new node to
    var parentNode = node;
    var childIndexes = [];
    while (parentNode.parent) {
      // determine the current nodes index in the parent nodes children
      childIndexes.unshift(parentNode.parent.children.indexOf(parentNode));

      // move on to next parent node
      parentNode = parentNode.parent;
    }

    // Use the child indexes to add the new node to the tree
    var newTree = JSON.parse(JSON.stringify(tree)); // deep clone of the tree
    var currentNode = newTree.data;
    for (var i = 0; i < childIndexes.length; i++) {
      var index = childIndexes[i];
      currentNode = currentNode.children[index];
    }
    currentNode.children = currentNode.children ? [].concat(_toConsumableArray(currentNode.children), [newNode]) : [newNode];
    onChange(newTree);
  }
  function highlightParents(node, peopleIds) {
    setNodeToHighlight(node);
    setNodePeopleToHighlight(peopleIds);
  }
  var treeId = lodash_get_default()(tree, '_id', '');
  var treeTitle = lodash_get_default()(tree, 'title', 'Untitled Tree');
  var treeCover = lodash_get_default()(tree, 'cover');
  var treeDescription = lodash_get_default()(tree, 'description', '');
  return /*#__PURE__*/react.createElement("div", {
    className: styles.root
  }, /*#__PURE__*/react.createElement("div", {
    className: styles.showTreeDetails,
    onClick: handleShowTreeDetails,
    style: onChange ? {
      top: 65
    } : {
      top: 0
    }
  }, /*#__PURE__*/react.createElement("i", {
    className: "icon-info",
    style: {
      marginRight: 7
    }
  }), " Tree Info"), personDetails && /*#__PURE__*/react.createElement(PersonDetails, {
    style: onChange ? {
      top: 65
    } : {
      top: 0
    },
    closeDetails: closePersonDetails,
    avatar: personDetails.avatar,
    firstName: personDetails.firstName,
    lastName: personDetails.lastName,
    bio: personDetails.bio,
    traits: personDetails.traits,
    aspirations: personDetails.aspirations,
    lifeStates: personDetails.lifeStates,
    parentType: parentType,
    parents: parents,
    adoptiveParents: adoptiveParents,
    custom: personDetails.custom,
    personId: personDetails._id,
    treeId: treeId
  }), treeDetails && /*#__PURE__*/react.createElement(TreeDetails, {
    style: onChange ? {
      top: 65
    } : {
      top: 0
    },
    closeDetails: closeTreeDetails,
    image: treeCover,
    title: treeTitle,
    description: treeDescription
  }), /*#__PURE__*/react.createElement("svg", {
    width: "100%",
    height: "100%",
    ref: svg
  }, /*#__PURE__*/react.createElement(CommonPatterns, null), /*#__PURE__*/react.createElement("g", {
    ref: zoom
  }, /*#__PURE__*/react.createElement("g", {
    className: "transform-layer"
  }, links.map(function (linkData, index) {
    return /*#__PURE__*/react.createElement(Link, {
      key: index,
      linkData: linkData
    });
  }), nodes.map(function (nodeData, index) {
    // if the node we are rendering is the one where we need to
    // highlight some people (parents) then pass the array of
    // nodePeopleToHighlight otherwise default to an empty array.
    var highlightPeople = [];
    if (nodeData === nodeToHighlight) {
      highlightPeople = nodePeopleToHighlight;
    }
    return /*#__PURE__*/react.createElement(Node, {
      key: index,
      nodeData: nodeData,
      people: people,
      highlightPeople: highlightPeople,
      highlightParents: highlightParents,
      showPersonDetails: showPersonDetails
    });
  })))));
});
;// CONCATENATED MODULE: ./src/components/trees/Download/index.jsx


/* harmony default export */ const Download = (function () {
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(TreeDownload, {
    tree: window.tree,
    people: window.people
  }));
});
;// CONCATENATED MODULE: ./src/Download.jsx






var root = client.createRoot(document.getElementById('app'));
root.render( /*#__PURE__*/react.createElement(Download, null));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkplum_tree_ui"] = self["webpackChunkplum_tree_ui"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [317], () => (__webpack_require__(126)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;