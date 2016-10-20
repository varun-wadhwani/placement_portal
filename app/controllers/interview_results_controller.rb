class InterviewResultsController < ApplicationController
	def index
		@data=InterviewResult.all
	end
end
