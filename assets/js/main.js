window.NavLink = function(navElId, currentPath) {
  this.el = document.getElementById(navElId);
  this.currentPath = currentPath;
  this.isActive = false;
  this.__activate();
};

NavLink.prototype.__activate = function() {
  if (this.__isActiveLink()) {
    this.el.className += "active";
    this.isActive = true;
  };
};

NavLink.prototype.__isActiveLink = function() {
  return this.currentPath.match(new RegExp("^" + this.__pathname())) != null;
};

NavLink.prototype.__pathname = function() {
  return "/" + this.el.pathname.replace(/^\//, '');
};

["nav-resume", "nav-about", "nav-blog"].some(function(navElId) {
  var link = new NavLink(navElId, location.pathname);
  return link.isActive;
});
