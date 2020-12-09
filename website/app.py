from flask import Flask, render_template, request, jsonify
import json
with open('static/data/simulations_test_sum.json','r') as f:
    json_data = json.load(f)
app = Flask(__name__)

# route to root of app. 
@app.route("/")
def index():
    return render_template("index.html")

# route to software-related pages. 
@app.route("/software/<sub_page>")
def software(sub_page):
    if sub_page == 'tech-overview':
        return render_template("tech-overview.html")
    if sub_page == 'demo':
        return render_template("demo.html")
        #return render_template("software.html")
    if sub_page == 'docs':
        return render_template("docs.html")
    else:
        return render_template("software.html")

# route to case study related pages. 
@app.route("/case-study/<sub_page>")
def case_study(sub_page):
    if sub_page == 'overview':
        return render_template("case-overview.html")
    elif sub_page == 'model-strategy':
        return render_template("model-strategy.html")
    elif sub_page == 'model-performance':
        return render_template("model-performance.html")
        #return render_template("case-study.html")
    else:   
        return render_template("case-study.html")

@app.route('/data',methods=['GET'])
def data():
    policy = request.args.get('policy', 'UCB1')
    try:
        greed_factor = float(request.args.get('greed_factor',1))
    except ValueError:
        greed_factor = 1.0
    try:
        ucb_scale = int(request.args.get('ucb_scale',None))
    except ValueError:
        ucb_scale = None
    try:
        epsilon = float(request.args.get('epsilon',None))
    except ValueError:
        epsilon = None
    strategy = request.args.get('strategy','round-robin')
    order = request.args.get('order','best')
    for record in json_data:
        if record['policy'] == policy and record['greed_factor'] == greed_factor and record["ucb_scale"] == ucb_scale and record["epsilon"] == epsilon  and record["strategy"] == strategy and record["order"] == order:
            return jsonify(record['timesteps'])
    return {'message':'No data matches your query.'}

# route to team page. 
@app.route("/team")
def team():
    return render_template("team.html")

if __name__ == '__main__':
    app.run()