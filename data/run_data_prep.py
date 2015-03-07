#!/usr/bin/python

from glob import glob
from mac_functions import remove_zeros, rename_nodes_sequential, make_color_string

input_files = glob("/home/vanessa/Documents/Dropbox/Code/Javascript/mac/data/*.csv")

# First remove rows of empty zeros at the end of the files
for ii in input_files:
  remove_zeros(ii)

# Now rename nodes from 1..N, we also want to sort the nodes by the length
sort_by_length=True
for ii in input_files:
  rename_nodes_sequential(ii,sort_by_length=sort_by_length)

# Make a string of colors to add to javascript
color_string = make_color_string(input_files)
