const fs = require('fs')

module.exports = [
  'theSrc/internal_www/data/aspect_ratio/data.json',
  'theSrc/internal_www/data/aspect_ratio/data_inverted.json',
  'theSrc/internal_www/data/bdd/bubbleplot_simple.json',
  'theSrc/internal_www/data/bdd/four_point_brand.json',
  'theSrc/internal_www/data/bdd/scatterplot_yaxis_not_visible.json',
  'theSrc/internal_www/data/bdd/three_point_brand.json',
  'theSrc/internal_www/data/displayr_regression/set1/bubbles.json',
  'theSrc/internal_www/data/displayr_regression/set1/bubbles_default_size.json',
  'theSrc/internal_www/data/displayr_regression/set1/dim1and4.json',
  'theSrc/internal_www/data/displayr_regression/set1/entereddata.json',
  'theSrc/internal_www/data/displayr_regression/set1/fonts.json',
  'theSrc/internal_www/data/displayr_regression/set1/hiddenLabels.json',
  'theSrc/internal_www/data/displayr_regression/set1/logos.json',
  'theSrc/internal_www/data/displayr_regression/set1/mirror_dim1and4.json',
  'theSrc/internal_www/data/displayr_regression/set1/supplementary.json',
  'theSrc/internal_www/data/displayr_regression/set2/bubble_chart.json',
  'theSrc/internal_www/data/displayr_regression/set2/bubble_colors.json',
  'theSrc/internal_www/data/displayr_regression/set2/column_principal_scaled.json',
  'theSrc/internal_www/data/displayr_regression/set2/correspondence_analysis1.json',
  'theSrc/internal_www/data/displayr_regression/set2/correspondence_analysis12.json',
  'theSrc/internal_www/data/displayr_regression/set2/correspondence_analysis2.json',
  'theSrc/internal_www/data/displayr_regression/set2/correspondence_analysis3.json',
  'theSrc/internal_www/data/displayr_regression/set2/correspondence_analysis4.json',
  'theSrc/internal_www/data/displayr_regression/set2/correspondence_analysis5.json',
  'theSrc/internal_www/data/displayr_regression/set2/correspondence_analysis7.json',
  'theSrc/internal_www/data/displayr_regression/set2/correspondence_analysis8.json',
  'theSrc/internal_www/data/displayr_regression/set2/correspondence_analysis9.json',
  'theSrc/internal_www/data/displayr_regression/set2/correspondence_analysis_4.json',
  'theSrc/internal_www/data/displayr_regression/set2/row_principal_scaled.json',
  'theSrc/internal_www/data/displayr_regression/set2/same_titles.json',
  'theSrc/internal_www/data/displayr_regression/set2/y_equals_zero.json',
  'theSrc/internal_www/data/displayr_regression/set2_focus/column_prinicpal.json',
  'theSrc/internal_www/data/displayr_regression/set2_focus/multiple_tables.json',
  'theSrc/internal_www/data/displayr_regression/set2_focus/principal.json',
  'theSrc/internal_www/data/displayr_regression/set2_focus/standard.json',
  'theSrc/internal_www/data/displayr_regression/set2_focus/symmertrical.json',
  'theSrc/internal_www/data/displayr_regression/set2_logo/logo.json',
  'theSrc/internal_www/data/displayr_regression/set2_logo/logo_small_ratio.json',
  'theSrc/internal_www/data/displayr_regression/set2_mirror/both_mirror.json',
  'theSrc/internal_www/data/displayr_regression/set2_mirror/d1_mirror.json',
  'theSrc/internal_www/data/displayr_regression/set2_mirror/d2_mirror.json',
  'theSrc/internal_www/data/displayr_regression/set2_mirror/no_mirror.json',
  'theSrc/internal_www/data/displayr_regression/set2_multiple_tables/multiple_table_named.json',
  'theSrc/internal_www/data/displayr_regression/set2_multiple_tables/multiple_table_reprint.json',
  'theSrc/internal_www/data/displayr_regression/set2_multiple_tables/multiple_table_transpose.json',
  'theSrc/internal_www/data/displayr_regression/set2_supplementary/focus_off_supplementary.json',
  'theSrc/internal_www/data/displayr_regression/set2_supplementary/focus_on_supplementary.json',
  'theSrc/internal_www/data/displayr_regression/set2_supplementary/long_footer.json',
  'theSrc/internal_www/data/displayr_regression/set2_supplementary/one_point.json',
  'theSrc/internal_www/data/displayr_regression/set2_supplementary/two_point.json',
  'theSrc/internal_www/data/displayr_regression/set2_title/entered_data.json',
  'theSrc/internal_www/data/displayr_regression/set2_title/entered_data_transpose.json',
  'theSrc/internal_www/data/displayr_regression/set2_title/no_titles.json',
  'theSrc/internal_www/data/displayr_regression/set3/plot_filtered.json',
  'theSrc/internal_www/data/displayr_regression/set3/plot_labelnames.json',
  'theSrc/internal_www/data/displayr_regression/set3/plot_variablenames.json',
  'theSrc/internal_www/data/displayr_regression/set4/distance_entered.json',
  'theSrc/internal_www/data/displayr_regression/set4/distance_metric.json',
  'theSrc/internal_www/data/displayr_regression/set4/distance_non_metric.json',
  'theSrc/internal_www/data/displayr_regression/set4/distance_object.json',
  'theSrc/internal_www/data/displayr_regression/set4/entered_data_non_metric.json',
  'theSrc/internal_www/data/displayr_regression/set6/equamax_plot.json',
  'theSrc/internal_www/data/displayr_regression/set6/equamax_reprint.json',
  'theSrc/internal_www/data/displayr_regression/set6/promax_plot.json',
  'theSrc/internal_www/data/displayr_regression/set6/promax_reprint.json',
  'theSrc/internal_www/data/displayr_regression/set6/varimax_plot.json',
  'theSrc/internal_www/data/displayr_regression/set6/varimax_reprint.json',
  'theSrc/internal_www/data/displayr_regression/set7/column_principal.json',
  'theSrc/internal_www/data/displayr_regression/set7/ignore_rows.json',
  'theSrc/internal_www/data/displayr_regression/set7/none.json',
  'theSrc/internal_www/data/displayr_regression/set7/row_col_titles.json',
  'theSrc/internal_www/data/displayr_regression/set7/row_principal.json',
  'theSrc/internal_www/data/displayr_regression/set7/scatterplot.json',
  'theSrc/internal_www/data/displayr_regression/set7/symmetric.json',
  'theSrc/internal_www/data/displayr_regression/set8/all_labelled.json',
  'theSrc/internal_www/data/displayr_regression/set8/large_transparent_points.json',
  'theSrc/internal_www/data/displayr_regression/set8/list_categories.json',
  'theSrc/internal_www/data/displayr_regression/set8/list_categories_with_filter.json',
  'theSrc/internal_www/data/displayr_regression/set8/mds_metric.json',
  'theSrc/internal_www/data/displayr_regression/set8/mds_nonmetric.json',
  'theSrc/internal_www/data/displayr_regression/set8/pca.json',
  'theSrc/internal_www/data/displayr_regression/set8/small_opaque_points.json',
  'theSrc/internal_www/data/displayr_regression/set8/tsne_perplexity_7.json',
  'theSrc/internal_www/data/displayr_regression/set8/tsne_perplexity_default.json',
  'theSrc/internal_www/data/displayr_regression/set9/bubblechart.json',
  'theSrc/internal_www/data/displayr_regression/set9/chart_1col_entered_with_names.json',
  'theSrc/internal_www/data/displayr_regression/set9/chart_1col_vector_with_names.json',
  'theSrc/internal_www/data/displayr_regression/set9/chart_customcolor.json',
  'theSrc/internal_www/data/displayr_regression/set9/chart_labeled.json',
  'theSrc/internal_www/data/displayr_regression/set9/chart_logos_debug.json',
  'theSrc/internal_www/data/displayr_regression/set9/chart_nogrid_labeled.json',
  'theSrc/internal_www/data/displayr_regression/set9/chart_pointsonly.json',
  'theSrc/internal_www/data/displayr_regression/set9/chart_unnamed_columns_ds1493.json',
  'theSrc/internal_www/data/displayr_regression/set9/charts_pointsonly_debug.json',
  'theSrc/internal_www/data/displayr_regression/set9/charts_prefix_suffix.json',
  'theSrc/internal_www/data/displayr_regression/set9/vardata_color_date_category_labelled.json',
  'theSrc/internal_www/data/displayr_regression/set9/vardata_color_numeric_more_labeled.json',
  'theSrc/internal_www/data/displayr_regression/set9/vardata_data_categoric_axis_labeled.json',
  'theSrc/internal_www/data/displayr_regression/set9/vardata_size_and_color_categoric_labeled.json',
  'theSrc/internal_www/data/displayr_regression/set9/vardata_size_data_labeled.json',
  'theSrc/internal_www/data/displayr_regression/set9/vardata_size_numeric_labeled.json',
  'theSrc/internal_www/data/displayr_regression/set9/vardata_size_numeric_labeled_filtered.json',
  'theSrc/internal_www/data/errors/error_message.json',
  'theSrc/internal_www/data/errors/error_xy.json',
  'theSrc/internal_www/data/errors/error_z.json',
  'theSrc/internal_www/data/legacy_bubble/bubbleplot_colas.json',
  'theSrc/internal_www/data/legacy_bubble/bubbleplot_colas_characteristics.json',
  'theSrc/internal_www/data/legacy_bubble/bubbleplot_labels_inside.json',
  'theSrc/internal_www/data/legacy_bubble/bubbleplot_legend1.json',
  'theSrc/internal_www/data/legacy_bubble/bubbleplot_legend2.json',
  'theSrc/internal_www/data/legacy_bubble/bubbleplot_life_expectancy.json',
  'theSrc/internal_www/data/legacy_bubble/bubbleplot_overlap.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/scatterplot_big_x_axis_labels.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/scatterplot_busy.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/scatterplot_categorical_bubble.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/scatterplot_categorical_simple.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/scatterplot_datetime.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/scatterplot_logos2.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/scatterplot_mass_points.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/scatterplot_mass_points_few_labels.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/scatterplot_simple.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/testData3.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/testData7.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/testData8.json',
  'theSrc/internal_www/data/legacy_misc_scatterplot/testData9.json',
  'theSrc/internal_www/data/logos/softdrink_logos.json',
  'theSrc/internal_www/data/trendlines/set4_with_trend.json',
  'theSrc/internal_www/data/trendlines/set4_without_trend.json',
  'theSrc/internal_www/data/trendlines/set5_logos_trendlines.json',
  'theSrc/internal_www/data/trendlines/set5_no_trendlines.json',
  'theSrc/internal_www/data/trendlines/set5_trendlines.json',
  'theSrc/internal_www/data/trendlines/set5_trendlines_2point.json',
  'theSrc/internal_www/data/trendlines/trendData1.json',
  'theSrc/internal_www/data/trendlines/trendData2.json'
].filter(path => fs.existsSync(`${__dirname}/../../../${path}`))