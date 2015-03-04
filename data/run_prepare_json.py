#!/usr/bin/python

from glob import glob
from mac_functions import prepare_json

input_files = glob("/home/vanessa/Documents/Dropbox/Code/Javascript/mac/data/*.csv")

for ii in input_files:
  output_file = ii.replace(".csv",".json")
  prepare_json(ii,output_file)


