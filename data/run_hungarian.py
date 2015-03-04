#!/usr/bin/python

from glob import glob
from mac_functions import do_hungarian

input_files = glob("/home/vanessa/Documents/Dropbox/Code/Javascript/mac/data/matrix_*.csv")

for ii in input_files:
  output_file = ii.replace("matrix_","")
  do_hungarian(ii,output_file)


