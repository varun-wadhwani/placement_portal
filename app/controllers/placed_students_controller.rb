class PlacedStudentsController < ApplicationController
	def index
		@data = PlacedStudent.all
	end
	def create
	end
end
