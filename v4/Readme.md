RESTFUL ROUTES USED IN THIS PROJECT

name           url              verb               desc
=============================================================================================
                                FOR CAMPGROUNDS
=============================================================================================
INDEX      /campgrounds         GET            displays the list all the capgrounds
NEW        /campgrounds/new     GET            displays a new form to create a new campground
CREATE     /campgrounds         POST           adds new campground to the DB
SHOW       /campgrounds/:id     GET            Shows info about a particular/specific campground

==============================================================================================
                                FOR COMMENTS
==============================================================================================
NEW        /campgrounds/:id/comment/new     GET            displays a new form to create a new comment
CREATE     /campgrounds/:id/comment         POST           adds new comment to the DB inside a specific campground
