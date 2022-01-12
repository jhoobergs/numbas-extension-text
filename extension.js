Numbas.addExtension("text", [], function (extension) {
  let scope = extension.scope;

  // write your extension code here

  let jme = Numbas.jme;
  let sig = jme.signature;

  let types = jme.types;
  let funcObj = jme.funcObj;
  let TString = types.TString;
  let TBool = types.TBool;
  let TList = types.TList;
  let THTML = types.THTML;

  let TTextArea = function (data) {
    let a = this;
    this.element = data;
    this.nb_rows = null;
    this.nb_columns = null;
    this.value = data;
    /*this.promise = data.promise; // ??
    // TODO
    this.promise.then(function ([el, student_worker, correct_result]) {
      a.student_worker = student_worker;
      a.element = el;
      a.correct_result = correct_result;
    });*/
  };
  jme.registerType(TTextArea, "textarea", {
    html: function (v) {
      return new jme.types.THTML(v.element);
    },
  });

  jme.display.registerType(TTextArea, {
    tex: function (v) {
      return "\\text{Textarea}"; // TODO: spacing
    },
    jme: function (v) {
      let data = v.tok.value;
      let f = new jme.types.TFunc("textarea");
      let tree = {
        tok: f,
        args: [
          { tok: jme.wrapValue(data.rows) },
          { tok: jme.wrapValue(data.columns) },
        ],
      };

      let jme_s = jme.display.treeToJME(tree);
      return jme_s;
      /*if(v.tok._to_jme) {
                    throw(new Numbas.Error("A GeoGebra applet refers to itself in its own definition."));
                }
                v.tok._to_jme = true;
                var data = v.tok.value.suspendData();
                var options = jme.wrapValue(data.options);
                var replacements = jme.wrapValue(data.replacements);
                var parts = jme.wrapValue(data.parts);
                var base64 = jme.wrapValue(data.base64);
                var cache = {};
                Object.keys(v.tok.cache).forEach(function(section) {
                    cache[section] = new TDict(v.tok.cache[section]);
                });
                var f = new jme.types.TFunc('resume_geogebra_applet');
                var tree = {
                    tok: f,
                    args: [
                        {tok: options},
                        {tok: replacements},
                        {tok: parts},
                        {tok: base64},
                        {tok: new TDict(cache)}
                    ]
                };
                var s = jme.display.treeToJME(tree);
                v.tok._to_jme = false;
      return s; */
    },
    displayString: function (v) {
      return "Textarea";
    },
  });

  /** Inject a textarea in the document.
   *
   * @returns {Promise} - resolves to the textarea
   */
  let showEditor = function (nb_rows, nb_columns) {
    //return new Promise(function (resolve, reject) {
    let element = document.createElement("div");
    let textarea = document.createElement("textarea");
    textarea.setAttribute("style", "display:block;min-width:600;");
    textarea.setAttribute("rows", nb_rows);
    textarea.setAttribute("columns", nb_columns);
    element.appendChild(textarea);
    return element;
    // resolve(element);
    //});
  };

  function TextArea(nb_rows, nb_columns) {
    let textarea = this;

    /*let promise = new Promise(function (resolve, reject) {
      let interval = setInterval(function () {
        if (element.parentNode) {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });*/

    this.nb_rows = nb_rows;
    this.nb_columns = nb_columns;
    return showEditor(nb_rows, nb_columns);

    /*promise = promise
      .then(function ([correct_result, student_worker]) {
        return showEditor(nb_rows, nb_columns);
      });
    this.promise = promise;*/
    /*if (parts && question) {
      question.signals.on("partsGenerated", function () {
        Object.keys(parts).forEach(function (key) {
          var path = parts[key];
          var part = question.getPart(path);
          if (!part) {
            throw new Numbas.Error(
              "The GeoGebra object " +
                key +
                " is supposed to link to the part with path " +
                parts[key] +
                ", but that doesn't exist."
            );
          }
          parts[key] = part;
        });
        promise
          .then(link_exercises_to_parts(parts))
          .then(link_objects_to_parts(parts));
      });
    }

    */
    /*
    promise
      .then(function (el) {
        element.innerHTML = "";
        element.appendChild(el);
      })
      .catch(function (e) {
        var msg = "Problem encountered when creating TextArea: " + e;
        element.innerHTML = msg;
        throw new Numbas.Error(msg);
      });

    this.used_to_mark_parts = {};*/
  }

  /** Create a TextArea with the given options
   *
   * @param {Number} nb_rows - The number of rows for the textarea
   * @param {Number} nb_columns - The number of columns for the textarea
   * @returns {Promise} - Resolves to `element`, where `element` is a textarea element.
   */
  createTextArea = extension.createTextArea = function (nb_rows, nb_columns) {
    return new TextArea(nb_rows, nb_columns);
  };

  let sig_textarea = sig.sequence(
    sig.type("integer"),
    sig.type("integer")
    //sig.optional(sig.type("boolean"))
  );

  extension.scope.addFunction(
    new funcObj(
      "textarea",
      [sig_textarea],
      TTextArea,
      null, // ??
      {
        evaluate: function (args, scope) {
          let match = sig_textarea(args);
          let nb_rows = args[0].value;
          let nb_columns = args[1].value;
          /*let show_expected_columns;
          if (match[2].missing) {
            show_expected_columns = false;
          } else {
            show_expected_columns = args[2].value;
          }*/
          return new TTextArea(createTextArea(nb_rows, nb_columns));
        },
      },
      { unwrapValues: true }
    )
  );
});
