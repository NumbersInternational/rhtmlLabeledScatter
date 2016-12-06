// Generated by CoffeeScript 1.8.0
var PlotLabel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PlotLabel = (function() {
  function PlotLabel(givenLabelArray, labelAlt, logoScale) {
    var i, label, _i, _len, _ref, _ref1;
    this.givenLabelArray = givenLabelArray;
    this.labelAlt = labelAlt;
    this.logoScale = logoScale;
    this._makeImgLabPromise = __bind(this._makeImgLabPromise, this);
    this._makeLabPromise = __bind(this._makeLabPromise, this);
    this.promiseLabelArray = [];
    console.log('constructor');
    _ref = this.givenLabelArray;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      label = _ref[i];
      if (this._isStringLinkToImg(label)) {
        labelAlt = ((_ref1 = this.labelAlt) != null ? _ref1[i] : void 0) != null ? this.labelAlt[i] : '';
        this.promiseLabelArray.push(this._makeImgLabPromise(label, labelAlt, this.logoScale[i]));
      } else {
        this.promiseLabelArray.push(this._makeLabPromise(label));
      }
    }
  }

  PlotLabel.prototype._makeLabPromise = function(label) {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return resolve({
          width: null,
          height: null,
          label: label,
          url: ''
        });
      };
    })(this));
  };

  PlotLabel.prototype._makeImgLabPromise = function(labelLink, labelAlt, scalingFactor) {
    if (scalingFactor == null) {
      scalingFactor = 1;
    }
    return new Promise((function(_this) {
      return function(resolve, reject) {
        var img;
        img = new Image();
        img.onload = function() {
          var adjH, adjW, aspectRatio, defaultArea, height, width;
          defaultArea = 10000 * scalingFactor;
          height = this.height != null ? this.height : 0;
          width = this.width != null ? this.width : 0;
          aspectRatio = width / height;
          adjW = Math.sqrt(defaultArea * aspectRatio);
          adjH = adjW / aspectRatio;
          img.src = '';
          return resolve({
            width: adjW,
            height: adjH,
            label: labelAlt,
            url: labelLink
          });
        };
        img.onerror = function() {
          var defaultErrorLogoSize;
          console.log('Error: Image URL not valid - ' + labelLink);
          defaultErrorLogoSize = 20;
          return resolve({
            width: defaultErrorLogoSize,
            height: defaultErrorLogoSize,
            label: '',
            url: DisplayError.get().getErrorImgUrl()
          });
        };
        return img.src = labelLink;
      };
    })(this));
  };

  PlotLabel.prototype._isStringLinkToImg = function(label) {
    return (_.includes(label, 'http://') || _.includes(label, 'https://')) && (_.includes(label, '.png') || _.includes(label, '.svg') || _.includes(label, '.jpg'));
  };

  return PlotLabel;

})();
