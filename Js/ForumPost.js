var ForumPost = {
					reply	:	function(obj){
									if(jQuery(".reply-to-this-thread a").attr("active")=="true"){
										return;
									}else{
										var html = '<div class="reply-post-container"><textarea id="reply" name="text" placeholder="write your reply here..."></textarea>';
										html += '<div class="submit-reply" ><button class="cancel" onclick="ForumPost.cancel();return false;">Cancel</button><button class="submit-post">Submit</button></div>';
										html += '</div><br style="clear:both"/>';
										jQuery(".reply-thread-container form").append(html);
										jQuery(".reply-to-this-thread a").attr("active","true");
									}
									
								},
					cancel	:	function(obj){
									jQuery(".reply-to-this-thread a").attr("active","false");
									jQuery(".reply-thread-container form").html("");
								},
					replyToThisPost	:	function(id,obj){
										if(jQuery(obj).attr("active")=="false"){
											var html = '<div class="reply-post-container"><textarea name="text" placeholder="write your reply here..."></textarea>';
											html += '<div class="submit-reply" ><button class="cancel" onclick="ForumPost.cancelReplyToThisPost('+id+');return false;">Cancel</button><button class="submit-post">Submit</button></div>';
											html += '</div><br style="clear:both"/>';
											jQuery("#reply-specfic-post-container-"+id+" form").append(html);
											jQuery(obj).attr("active","true");
										}else{
											return;
										}
								},
					cancelReplyToThisPost	:	function(id){
									jQuery("#reply-specfic-post-container-"+id).next().find("a").attr("active","false");
									jQuery("#reply-specfic-post-container-"+id+ " form").html("");
								},
					submitThreadReply	:	function(){
									
									return false;
								},
					submitReplyToPost	:	function(){
									
								},
					loadMorePost	:	function(){
									var html = jQuery("#post-dummy").html();
									var count = jQuery(".post").length;
									
									html = html.replace("{{name}}","Sepiroth");
									html = html.replace("{{post_number}}","#10");
									html = html.replace("{{posted_on}}","2 February 2014 - 6:40PM");
									html = html.replace("{{location}}","Philippines");
									html = html.replace("{{number_of_posts}}","100");
									html = html.replace("{{like_count}}","100");
									html = html.replace("{{dislike_count}}","5");
									html = html.replace("{{post_text}}","Lorem ipsum dolor lit. Dolor Lit..");
									html = html.replace(/{{param_id}}/g,++count);
									
									var li = jQuery('<li class="post" style="display:none">');
									li.html(html);
									jQuery(".post-list").append(li);
									li.fadeIn(500);
								},
					bindLikeButton 	:	function(){
									jQuery(".like").click(function(){
										 var like_url = jQuery(this).attr("href");
										 var comment_id = jQuery(this).attr("comment_id");
										 jQuery.ajax({
											url 	:	like_url,
											success	:	function(response){
												jQuery("#likes_of_this_comment_"+comment_id).html(response.trim());
											}
										 });
										 return false;
									})
								},
					bindUnLikeButton 	:	function(){
									jQuery(".unlike").click(function(){
										 var like_url = jQuery(this).attr("href");
										 var comment_id = jQuery(this).attr("comment_id");
										 jQuery.ajax({
											url 	:	like_url,
											success	:	function(response){
												jQuery("#likes_of_this_comment_"+comment_id).html(response.trim());
											}
										 });
										 return false;
									})
								},
					bindResponseButton 	:	function(){
									jQuery(".post").click(function(){
										jQuery(".report-popup").removeClass("active");
									});
									
									jQuery(".report").click(function(){
										if(jQuery(this).next().hasClass("active")){
											jQuery(this).next().removeClass("active");
										}else{
											jQuery(".report-popup").removeClass("active");
											jQuery(this).next().addClass("active");
										}
										return false;
									})
								},
					bindSettingButton	:	function(){
									jQuery(".fdata").click(function(){
										jQuery(".settings-popup").removeClass("active");
									});
									
									jQuery(".thread-settings").click(function(){
										if(jQuery(this).next().hasClass("active")){
											console.log(jQuery(this).next());
											jQuery(this).next().removeClass("active");
										}else{
											jQuery(".settings-popup").removeClass("active");
											jQuery(this).next().addClass("active");
										}
										return false;
									})
								},
					reportAs			:	function(obj,comment_id,type){
											var like_url = "http://[Url.DomainName]/forum/report/"+comment_id+"/"+type;
											
											jQuery.ajax({
												url 	:	like_url,
												success	:	function(response){
													console.log(response);
													jQuery(obj).parent().removeClass("active");
													//jQuery("#likes_of_this_comment_"+comment_id).html(response.trim());
													
												}
											});
										},
					deleteComment		:	function(comment_id){
									var delete_url = "http://[Url.DomainName]/forum/delete/"+comment_id;
									window.location.href = delete_url;
								},
					threadActions	:	function(thread_id,actions){
									switch(actions){
										case 'enable'	: { var url = "http://[Url.DomainName]/forum/EnabledThread/"+thread_id; window.location.href = url; }break;
										case 'block'	: { var url = "http://[Url.DomainName]/forum/BlockedThread/"+thread_id; window.location.href = url; }break;
										case 'delete'	: { var url = "http://[Url.DomainName]/forum/DeleteThread/"+thread_id; window.location.href = url; }break;
										case 'pinned'	: { var url = "http://[Url.DomainName]/forum/PinnedThread/"+thread_id; window.location.href = url; }break;
										case 'makeprio'	: { var url = "http://[Url.DomainName]/forum/PrioThread/"+thread_id; window.location.href = url; }break;
										case 'edit'		: {
															var old_value = jQuery('.thread-description blockquote').html();
															jQuery(".thread-description blockquote").hide();
															var textarea = jQuery('<textarea id="thread-description" class="input-data">');
															var button_html = '<div class="edit-comment-button"><a href="#" onclick="ForumPost.cancelUpdateComment('+thread_id+');return false;">Cancel</a>';
															button_html += '&nbsp;|&nbsp; <a href="#" onclick="ForumPost.updateComment('+thread_id+');return false;">Update</a></div>';
															textarea.html(old_value);
															var div = jQuery('<div id="edit-comment-container">');
															div.append(textarea);
															div.append(button_html);
															jQuery('.thread-description').append(div);
														  }break;
									}
								},
					updateComment 	:	function(thread_id){
											var url = "http://[Url.DomainName]/forum/edit/"+thread_id;
											console.log(url);
											jQuery.post( url, { text: jQuery("#thread-description").val() }).done(
												function( data ) {
    												window.location.href = "http://[Url.DomainName]/forum/thread/"+thread_id;
  												});
								},
					cancelUpdateComment	:	function(){
										jQuery("#edit-comment-container").remove();
										jQuery(".thread-description blockquote").css('display','block');
					},
				}
