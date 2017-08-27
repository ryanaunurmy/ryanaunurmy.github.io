		<section class="col-lg-6">
				<div class="box box-solid bg-red-gradient">
						<div class="box-header ui-sortable-handle" style="cursor: move;">
							<i class="fa fa-rocket"></i>

							<h3 class="box-title">SHA-256 Server</h3>
							<!-- tools box -->
							<div class="pull-right box-tools">
								<!-- button with a dropdown -->
						 
								<button type="button" class="btn btn-transparent btn-sm" data-widget="collapse"><i class="fa fa-minus"></i>
								</button>
								<button type="button" class="btn btn-transparent btn-sm" data-widget="remove"><i class="fa fa-times"></i>
								</button>
							</div>
							<!-- /. tools -->
						</div>
						<!-- /.box-header -->
						<div class="box-body no-padding">
						<div class="text-center">
							<span class="fa fa-4x fa-rocket"></span>
						<h2>{{ dashboard.hash.sha256 }} GH/s</h2>
						<h4>Hashrate</h4>
						</div>
						</div>
						<!-- /.box-body -->
						<div class="box-footer text-black">
							<div class="row">
								<div class="col-sm-6">
									<!-- Progress bars -->
									<div class="panel-footer--child clearfix">
										<span class="pull-left"><b class="text-red">{{ dashboard.func.predic('d', 'sha256') | limitTo:11:0 }} BTC</b></span>
										<small class="label label-primary pull-right">1d</small>
									</div>

									<div class="panel-footer--child clearfix">
										<span class="pull-left"><b class="text-red">{{ dashboard.func.predic('w', 'sha256') | limitTo:11:0 }} BTC</b></span>
										<small class="label bg-yellow pull-right">1w</small>
									</div>
								</div>
								<!-- /.col -->
								<div class="col-sm-6">
									<div class="panel-footer--child clearfix">
										<span class="pull-left"><b class="text-red">{{ dashboard.func.predic('m', 'sha256') | limitTo:11:0 }} BTC</b></span>
										<small class="label bg-green pull-right">1m</small>
									</div>

									<div class="panel-footer--child clearfix">
										<span class="pull-left"><b class="text-red">{{ dashboard.func.predic('y', 'sha256') | limitTo:11:0 }} BTC</b></span>
										<small class="label bg-red pull-right">1y</small>
									</div>
								</div>
								<!-- /.col -->
					</div>
					<!-- /.row -->
				</div>
			</div>
		</section>








BUY.html
=================

	<h3 class="active"><i class="fa fa-server"></i> SHA-256 Server</h2>
	<div class="row">
		<div class="col-lg-3 col-md-4" ng-repeat="harga in hargas.sha256">
			<div class="box box-solid shadow">
				<div class="box-body">
					<div class="text-center buy-item">
						<h3>{{ harga.title }}</h3>
						<small>{{ harga.caption }}</small>
						<h1>{{ harga.harga }} BTC</h1>
						<h2 class="text-yellow" >{{ harga.hashrate }} GH/s</h2>
						<ul class="no-padding">
							<li ng-repeat="list in harga.keterangan">{{list}}</li>
						</ul>
					</div>
				</div>
				<div class="box-footer text-black text-center">
					<a ng-href="{{harga.href}}" class="btn-nyanhash bg-yellow-gradient">BELI</a>
				</div>
			</div>
		</div>
		<div class="col-lg-3 col-md-4">
			<div class="box box-solid shadow">
				<div class="box-body">
					<div class="text-center buy-item">
						<h3>Custom</h3>
						<small>Custom Mining</small>
						<h1>0 BTC</h1>
						<h2 class="text-yellow" >0 GH/s</h2>
						<ul class="no-padding">
							<li>Lifetime</li>
							<li>Dikenakan biaya maintence</li>
						</ul>
					</div>
				</div>
				<div class="box-footer text-black text-center">
					<a href="" class="btn-nyanhash bg-yellow-gradient">BELI</a>
				</div>
			</div>
		</div>
	</div>