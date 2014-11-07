Struct.new bloats your public API
Makes sense to strictly represent data, but only in narrow use cases
Data should be represented with getters and aptly named setters that may not
necessarily match the name of the getter (i.e. User#role= should be replaced
with something like User#promote_user)
